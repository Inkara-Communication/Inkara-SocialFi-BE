// transaction.service.ts

import { Injectable, Logger } from '@nestjs/common'
import { Web3Service } from '@common/providers'
import { Network } from '@prisma/client'
import { ethers } from 'ethers'
import { bigNumber } from '@common/helper'
import { CreateSignatureDto } from '../dto/create-signature.dto'

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

  async getBalance(address: string): Promise<number> {
    const balanceWei = await this.web3Service.getBalance(
      Network.EMERALD,
      address
    )
    const balanceEther = parseFloat(ethers.utils.formatEther(balanceWei))
    return balanceEther
  }

  async getAllowance(address: string, spender: string): Promise<number> {
    const allowanceWei = await this.web3Service.getAllowance(
      Network.EMERALD,
      address,
      spender
    )
    const allowanceEther = parseFloat(
      ethers.utils.formatEther(bigNumber(allowanceWei))
    )
    return allowanceEther
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

  async getBlockNumber() {
    return await this.web3Service.getBlockNumber(Network.EMERALD)
  }

  async createSignature(data: CreateSignatureDto) {
    const { methodData, contractAddress, privateKey } = data
    return await this.web3Service.createSignature(
      Network.EMERALD,
      methodData,
      contractAddress,
      privateKey
    )
  }
}
