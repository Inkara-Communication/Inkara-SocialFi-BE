// auth.service.ts

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { IPayloadUserJwt } from '@common/interfaces'
import { GeneratorService, Web3Service } from '@common/providers'
import { UserService } from '@modules/user/services/user.service'
import { PrismaService } from '@prisma/prisma.service'
import { RedisE } from '@redis/redis.enum'
import { RedisService } from '@redis/redis.service'
import { ForbiddenException, NotFoundException } from '../../../errors'
import { SigninDto } from '../dto/signin.dto'
import { TokenService } from './token.service'
import {
  ListAddressIndexInput,
  VerifyGoogleInput
} from '@modules/auth/dto/signin-google.dto'
import { ethers } from 'ethers'
import assert from 'assert'
import * as bip39 from 'bip39'
import CryptoJS from 'crypto-js'
import { OAuth2Client, type TokenPayload } from 'google-auth-library'

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name)
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly generatorService: GeneratorService,
    private readonly web3Service: Web3Service
  ) {}

  async validateUser({ address }: SigninDto): Promise<boolean> {
    this.logger.log(`${'*'.repeat(20)} validateUser() ${'*'.repeat(20)}`)
    this.logger.log(address)
    // const user = await this.prismaService.user.findUnique({
    //   where: { address }
    // })
    // return this.tokenService.compare(password, user.password);
    return true
  }

  public async VerifyGoogle({ googleTokenId }: VerifyGoogleInput) {
    try {
      const client = new OAuth2Client()
      const ticket = await client.verifyIdToken({
        idToken: googleTokenId
      })
      const payload = ticket.getPayload() as TokenPayload
      const { email, name } = payload

      let user = await this.prismaService.user.findUnique({
        where: { email }
      })

      if (!user) {
        const mnemonic = this.createWallet()
        const encryptedMnemonic = CryptoJS.AES.encrypt(mnemonic, '').toString()
        const privateKey = await this.web3Service.getPrivateIndex(
          encryptedMnemonic,
          0
        )
        const address = new ethers.Wallet(privateKey).address
        user = await this.prismaService.user.create({
          data: {
            id: this.generatorService.uuid(),
            username: name,
            address: address,
            email,
            mnemonic: encryptedMnemonic,
            nonce: this.generatorService.generateRandomNonce(),
            lastLoginAt: new Date()
          }
        })
      } else {
        user = await this.prismaService.user.update({
          where: { email },
          data: { lastLoginAt: new Date() }
        })
      }
      return user
    } catch (error: any) {
      throw error.message
    }
  }

  public createWallet = () => {
    const wallet = ethers.Wallet.createRandom()
    const mnemonic = wallet.mnemonic.phrase
    return mnemonic
  }

  public getAddressIndexs = async (mnemonic: string, listIndex: number[]) => {
    assert(bip39.validateMnemonic(mnemonic), 'Invalid mnemonic')
    const listAddress = []
    for (const element of listIndex) {
      const { address } = ethers.utils.HDNode.fromMnemonic(mnemonic).derivePath(
        `m/44'/60'/0'/0/${element}`
      )
      listAddress.push(address)
    }
    return listAddress
  }

  public async getAddressIndexWallet({
    googleTokenId,
    listIndex
  }: ListAddressIndexInput) {
    try {
      const client = new OAuth2Client()
      const ticket = await client.verifyIdToken({
        idToken: googleTokenId
      })
      const payload = ticket.getPayload() as TokenPayload
      const { email } = payload

      const user = await this.prismaService.user.findUnique({
        where: { email }
      })
      const mnemonic = user?.mnemonic || ''
      const decryptedBytes = CryptoJS.AES.decrypt(mnemonic, '')
      const decryptedMnemonic = decryptedBytes.toString(CryptoJS.enc.Utf8)
      if (typeof mnemonic === 'string') {
        const listAddress = await this.getAddressIndexs(
          decryptedMnemonic,
          listIndex
        )
        return listAddress
      } else {
        throw new Error('Mnemonic is undefined')
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  public async signIn({ address, signature }: SigninDto) {
    const user = await this.userService.getUser({
      where: { address }
    })
    if (!user) {
      throw new BadRequestException('Provided address is invalid')
    }
    const [isValid, err] = await this.tokenService.verifySignature(
      user.address,
      user.nonce,
      signature
    )
    if (err) throw new HttpException(err, HttpStatus.EXPECTATION_FAILED)
    if (!isValid)
      throw new HttpException(
        'Provided signature is invalid',
        HttpStatus.EXPECTATION_FAILED
      )

    const authTokens = await this.generateAuthToken({
      id: user.id,
      address: user.address
    })
    return authTokens
  }

  public async signout(userId: string): Promise<boolean> {
    await this.removeJwtRefreshToken(userId)
    return true
  }

  public async generateAuthToken(payload: IPayloadUserJwt) {
    return {
      accessToken: await this.createAccessToken(payload),
      refreshToken: await this.createRefreshToken(payload)
    }
  }

  public async createAccessToken(payload: IPayloadUserJwt) {
    const secrets = this.configService.get('secrets')

    return this.jwtService.signAsync(payload, {
      expiresIn: secrets.JWT_EXPIRE_TIME
    })
  }

  public async createRefreshToken(payload: IPayloadUserJwt) {
    const secrets = this.configService.get('secrets')
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: secrets.JWT_REFRESH_PRIVATE_KEY,
      expiresIn: secrets.JWT_EXPIRE_REFRESH_TIME
    })
    const hashedRefreshToken = await this.tokenService.hash(refreshToken)
    await this.redisService.client.setex(
      `${RedisE.REDIS_REFRESH_TOKEN}:${payload.id}`,
      secrets.JWT_EXPIRE_REFRESH_TIME,
      hashedRefreshToken,
      (err, res) => {
        if (err) {
          throw new InternalServerErrorException(err)
        }
        return res
      }
    )
    return refreshToken
  }

  public async validateAccessToken(userId: string) {
    const savedRefreshToken = await this.redisService.client.get(
      `${RedisE.REDIS_REFRESH_TOKEN}:${userId}`
    )
    if (!savedRefreshToken) {
      throw new NotFoundException('Token is invalid')
    }
  }

  public async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.getUser({
      where: { id: userId }
    })
    const savedRefreshToken = await this.redisService.client.get(
      `${RedisE.REDIS_REFRESH_TOKEN}:${userId}`
    )
    if (!savedRefreshToken) {
      throw new NotFoundException('Token is invalid')
    }
    const isMatched = await this.tokenService.compare(
      refreshToken,
      savedRefreshToken
    )
    if (!isMatched) {
      throw new BadRequestException('The refresh token is not valid.')
    }
    if (savedRefreshToken) {
      return user
    }
  }

  public async refreshTokens(payload: IPayloadUserJwt, refreshToken: string) {
    if (!payload.id || !payload.address)
      throw new ForbiddenException('Access denied.')

    const user = await this.validateRefreshToken(payload.id, refreshToken)
    if (!user) throw new ForbiddenException('refresh_token_expired')

    return await this.generateAuthToken(payload)
  }

  async removeJwtRefreshToken(userId: string) {
    const user = await this.userService.getUser({
      where: { id: userId }
    })

    const deletedResult = await this.redisService.client.del(
      `${RedisE.REDIS_REFRESH_TOKEN}:${userId}`
    )

    if (deletedResult === 1) {
      return user
    } else {
      throw new NotFoundException('The refresh token was not found')
    }
  }
}
