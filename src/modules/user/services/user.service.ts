// user.service.ts

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger
} from '@nestjs/common'
import { GeneratorService, Web3Service } from '@common/providers'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from '@prisma/prisma.service'
import {
  ListAddressIndexInput,
  UpdateUsernameDto,
  VerifyGoogleInput
} from '@modules/user/dto'
import { ethers } from 'ethers'
import assert from 'assert'
import * as bip39 from 'bip39'
import CryptoJS from 'crypto-js'
import { OAuth2Client, type TokenPayload } from 'google-auth-library'

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name)
  constructor(
    private prismaService: PrismaService,
    private generatorService: GeneratorService,
    private readonly web3Service: Web3Service
  ) {}

  public async VerifyGoogle({ google_token_id }: VerifyGoogleInput) {
    try {
      const client = new OAuth2Client()
      const ticket = await client.verifyIdToken({
        idToken: google_token_id
      })
      const payload = ticket.getPayload() as TokenPayload
      const { sub, email, name } = payload

      let user = await this.prismaService.user.findUnique({
        where: { email }
      })

      if (!user) {
        const mnemonic = this.createWallet()
        const encryptedMnemonic = CryptoJS.AES.encrypt(mnemonic, '').toString()
        user.mnemonic = encryptedMnemonic
        // const privateKey = await this.web3Service.getPrivateIndex(mnemonic, 0)
        // const walletAddress = ethers.Wallet.fromPrivateKey(privateKey).address

        user = await this.prismaService.user.create({
          data: {
            id: this.generatorService.uuid(),
            username: name,
            walletAddress: 'walletAddress',
            google_id: sub,
            email,
            mnemonic: encryptedMnemonic,
            nonce: this.generatorService.generateRandomNonce()
          }
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
    google_token_id,
    listIndex
  }: ListAddressIndexInput) {
    try {
      const client = new OAuth2Client()
      const ticket = await client.verifyIdToken({
        idToken: google_token_id
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
    } catch (error: any) {
      throw error.message
    }
  }

  /* Queries */
  public async getUser(args: Prisma.UserFindUniqueArgs): Promise<User> {
    return await this.prismaService.user.findUnique(args)
  }

  public async getManyUsers(args: Prisma.UserFindManyArgs): Promise<User[]> {
    return await this.prismaService.user.findMany(args)
  }

  public async countManyUsers(args: Prisma.UserCountArgs): Promise<number> {
    return await this.prismaService.user.count(args)
  }

  public async updateOneUser(args: Prisma.UserUpdateArgs): Promise<User> {
    try {
      return await this.prismaService.user.update({
        ...args
      })
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  public async deleteOneUser(args: Prisma.UserDeleteArgs): Promise<User> {
    try {
      return await this.prismaService.user.delete(args)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  public async updateUsername(userId: string, { username }: UpdateUsernameDto) {
    const existingUsername = await this.prismaService.user.findUnique({
      where: { username: username }
    })
    if (existingUsername)
      throw new BadRequestException('username already exists')

    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { username }
    })
    // const authTokens = await this.authService.generateAuthToken({
    //   id: user.id,
    //   username,
    //   roles: user.roles,
    // })
    // await this.authService.updateRefreshToken({ username }, authTokens.refreshToken)
    return user
  }

  public async availableUsername({ username }: UpdateUsernameDto) {
    this.logger.log(
      `${'*'.repeat(20)} availableUsername(${username}) ${'*'.repeat(20)}`
    )
    return !(await this.prismaService.user.findUnique({
      where: { username: username }
    }))
  }
}
