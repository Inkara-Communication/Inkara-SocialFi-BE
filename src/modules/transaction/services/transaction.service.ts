// transaction.service.ts

import { Injectable, Logger } from '@nestjs/common'
import { Web3Service } from '@common/providers'
import { Network } from '@prisma/client'

@Injectable()
export class TransactionService {
  private logger = new Logger(TransactionService.name)
  constructor(private readonly web3Service: Web3Service) {}

  async getTransactionDetail(transactionHash: string) {
    return await this.web3Service.getTransaction(
      Network.EMERALD,
      transactionHash
    )
  }

  async getTransactionReceipt(transactionHash: string) {
    return await this.web3Service.getTransactionReceipt(
      Network.EMERALD,
      transactionHash
    )
  }

  async getBalance(address: string) {
    return await this.web3Service.getBalance(Network.EMERALD, address)
  }

  async getAllowance(address: string, spender: string) {
    return await this.web3Service.getAllowance(
      Network.EMERALD,
      address,
      spender
    )
  }

  async signMessage(
    user_address: string,
    amount_withdraw: string,
    nonce: string
  ) {
    return await this.web3Service.signMessage(
      user_address,
      amount_withdraw,
      nonce
    )
  }

  async signAndSendTransaction(userSignature: string) {
    return await this.web3Service.signAndSendTransaction(userSignature)
  }

  async getBlockNumber() {
    return await this.web3Service.getBlockNumber(Network.EMERALD)
  }
}
