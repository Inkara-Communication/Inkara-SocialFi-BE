import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Web3Service } from './web3.service'
import { Network } from '@prisma/client'
import { EventLog } from 'web3-eth-contract'
import { GeneratorService } from './generator.service'
import { CONTRACT_NAME } from '@common/constants'

const globalVariable: any = global

globalVariable.isSyncingGetDataFromSmartContract = false

@Injectable()
export class SynchronizeService {
  private logger = new Logger(SynchronizeService.name)

  constructor(
    private readonly prismaService: PrismaService,
    private readonly web3Service: Web3Service,
    private readonly generatorService: GeneratorService
  ) {}

  sortByTransactionIndex = (a: EventLog, b: EventLog) =>
    Number(a.transactionIndex) - Number(b.transactionIndex)

  async synchronizeNFT() {
    const inkaraNftContract = this.web3Service.getInkaraNftContract(
      Network.EMERALD
    )

    const contract = await this.prismaService.contract.findFirst({
      where: { contractName: CONTRACT_NAME.INKARA_NFT }
    })

    if (!contract) {
      await this.prismaService.contract.create({
        data: {
          id: this.generatorService.uuid(),
          contractName: CONTRACT_NAME.INKARA_NFT
        }
      })
      globalVariable.isSyncingGetDataFromSmartContract = false
      return
    }

    const lastBlockNumberNft = await this.getLastBlockNumber(contract.id)

    const lastBlockNumberOnchainNft = Math.min(
      Number(await this.web3Service.getBlockNumber(Network.EMERALD)),
      lastBlockNumberNft + 100
    )

    const getPastEventsConfig = {
      fromBlock: lastBlockNumberNft,
      toBlock: lastBlockNumberOnchainNft
    }

    const eventNewNftCreated = await inkaraNftContract.getPastEvents(
      'allEvents',
      getPastEventsConfig
    )

    this.logger.log(`Synchronizing ${eventNewNftCreated.length} NFT events`)

    const listNewNftCreated = eventNewNftCreated
      .sort(this.sortByTransactionIndex)
      .map((e: any) => ({
        user: e.returnValues.user,
        tokenId: e.returnValues.tokenId,
        transactionHash: e.transactionHash,
        blockNumber: e.blockNumber
      }))
    const nftTxHash: string[] = []

    nftTxHash.push(
      ...eventNewNftCreated.map((e: any) => e.returnValues.tokenId)
    )

    await this.prismaService.transaction.create({
      data: {
        id: this.generatorService.uuid(),
        contractId: contract.id,
        blockNumber: lastBlockNumberOnchainNft,
        transactionHash: nftTxHash.length > 0 ? nftTxHash : []
      }
    })

    this.logger.log(`Synchronized ${nftTxHash.length} NFT transactions`)

    for (const newNftCreated of listNewNftCreated) {
      try {
        // Logic xử lý cho NFT
        console.log(newNftCreated)
      } catch (error: any) {
        this.logger.error(`Cannot insert NFT, error: ${error.message}`)
      }
    }
  }

  async synchronizeReward() {
    const inkaraRewardContract = this.web3Service.getInkaraRewardContract(
      Network.EMERALD
    )

    const contract = await this.prismaService.contract.findFirst({
      where: { contractName: CONTRACT_NAME.INKARA_REWARD }
    })

    if (!contract) {
      await this.prismaService.contract.create({
        data: {
          id: this.generatorService.uuid(),
          contractName: CONTRACT_NAME.INKARA_REWARD
        }
      })
      globalVariable.isSyncingGetDataFromSmartContract = false
      return
    }

    const lastBlockNumberReward = await this.getLastBlockNumber(contract.id)

    const lastBlockNumberOnchainReward = Math.min(
      Number(await this.web3Service.getBlockNumber(Network.EMERALD)),
      lastBlockNumberReward + 100
    )

    const getPastEventsConfig = {
      fromBlock: lastBlockNumberReward,
      toBlock: lastBlockNumberOnchainReward
    }

    const eventNewReward = await inkaraRewardContract.getPastEvents(
      'allEvents',
      getPastEventsConfig
    )

    this.logger.log(`Synchronizing ${eventNewReward.length} Reward events`)

    const listNewReward = eventNewReward
      .sort(this.sortByTransactionIndex)
      .map((e: any) => ({
        user: e.returnValues.user,
        tokenId: e.returnValues.tokenId,
        transactionHash: e.transactionHash,
        blockNumber: e.blockNumber
      }))
    const rewardTxHash: string[] = []

    rewardTxHash.push(...eventNewReward.map((e: any) => e.returnValues.tokenId))

    await this.prismaService.transaction.create({
      data: {
        id: this.generatorService.uuid(),
        contractId: contract.id,
        blockNumber: lastBlockNumberOnchainReward,
        transactionHash: rewardTxHash.length > 0 ? rewardTxHash : []
      }
    })

    this.logger.log(`Synchronized ${rewardTxHash.length} Reward transactions`)

    for (const newReward of listNewReward) {
      try {
        // Logic xử lý cho Reward
        console.log(newReward)
      } catch (error: any) {
        this.logger.error(`Cannot insert Reward, error: ${error.message}`)
      }
    }
  }

  async getLastBlockNumber(contractId: string): Promise<number> {
    const lastSync = await this.prismaService.transaction.findFirst({
      where: { contractId },
      orderBy: { blockNumber: 'desc' }
    })

    return (lastSync?.blockNumber || 0) + 1
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async onJobGetDataFromSmartContract() {
    if (globalVariable.isSyncingGetDataFromSmartContract) return
    globalVariable.isSyncingGetDataFromSmartContract = true

    try {
      await this.synchronizeNFT()
      await this.synchronizeReward()
    } catch (error) {
      this.logger.error(`onJobGetDataFromSmartContract: ${error.message}`)
    } finally {
      globalVariable.isSyncingGetDataFromSmartContract = false
    }
  }
}
