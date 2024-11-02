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

  async synchronizeBadge() {
    const inkaraBadgeContract = this.web3Service.getInkaraBadgeContract(
      Network.EMERALD
    )

    const contract = await this.prismaService.contract.findFirst({
      where: { contractName: CONTRACT_NAME.INKARA_BADGE }
    })

    if (!contract) {
      await this.prismaService.contract.create({
        data: {
          id: this.generatorService.uuid(),
          contractName: CONTRACT_NAME.INKARA_BADGE
        }
      })
      globalVariable.isSyncingGetDataFromSmartContract = false
      return
    }

    const lastBlockNumberBadge = await this.getLastBlockNumber(contract.id)

    const lastBlockNumberOnchainBadge = Math.min(
      Number(await this.web3Service.getBlockNumber(Network.EMERALD)),
      lastBlockNumberBadge + 100
    )

    const getPastEventsConfig = {
      fromBlock: lastBlockNumberBadge,
      toBlock: lastBlockNumberOnchainBadge
    }

    const eventNewBadge = await inkaraBadgeContract.getPastEvents(
      'allEvents',
      getPastEventsConfig
    )

    this.logger.log(`Synchronizing ${eventNewBadge.length} Badge events`)

    const listNewBadge = eventNewBadge
      .sort(this.sortByTransactionIndex)
      .map((e: any) => ({
        user: e.returnValues.user,
        tokenId: e.returnValues.tokenId,
        transactionHash: e.transactionHash,
        blockNumber: e.blockNumber
      }))
    const badgeTxHash: string[] = []

    badgeTxHash.push(...eventNewBadge.map((e: any) => e.returnValues.tokenId))

    await this.prismaService.transaction.create({
      data: {
        id: this.generatorService.uuid(),
        contractId: contract.id,
        blockNumber: lastBlockNumberOnchainBadge,
        transactionHash: badgeTxHash.length > 0 ? badgeTxHash : []
      }
    })

    this.logger.log(`Synchronized ${badgeTxHash.length} Badge transactions`)

    for (const newBadge of listNewBadge) {
      try {
        // Logic xử lý cho Badge
        console.log(newBadge)
      } catch (error: any) {
        this.logger.error(`Cannot insert Badge, error: ${error.message}`)
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
      await this.synchronizeBadge()
    } catch (error) {
      this.logger.error(`onJobGetDataFromSmartContract: ${error.message}`)
    } finally {
      globalVariable.isSyncingGetDataFromSmartContract = false
    }
  }
}
