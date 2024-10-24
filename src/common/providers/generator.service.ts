import { Injectable } from '@nestjs/common'
import { nanoid } from 'nanoid'
import { ethers } from 'ethers'

@Injectable()
export class GeneratorService {
  public uuid(len = 16): string {
    return nanoid(len)
  }
  public createRefreshTokenId(): string {
    return this.uuid()
  }
  public fileName(imageBuffer: string): string {
    return ethers.utils.keccak256(imageBuffer)
  }

  public generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  public generateSlug(token_id: string): string {
    return `${ethers.utils.hashMessage(token_id).slice(2, 16)}`.toLowerCase()
  }

  /**
   * generate random string
   * @param length
   */
  public generateRandomString(length = 6): string {
    return ethers.utils
      .hexlify(ethers.utils.randomBytes(length))
      .substring(0, length)
      .toUpperCase()
  }
  /**
   * generate random nonce
   * "We use a nonce to make sure your interactions are secure, and it won't cost you anything. It's like an extra lock to keep your online activities safe."
   * @param length
   */
  public generateRandomNonce(length = 6): string {
    const randomValue = ethers.utils.randomBytes(32)
    return ethers.utils
      .keccak256(randomValue)
      .substring(0, length)
      .toUpperCase()
  }
}
