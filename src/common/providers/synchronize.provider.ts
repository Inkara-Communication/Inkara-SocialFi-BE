import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Web3Service } from './web3.service'
import { Network } from '@prisma/client'
import { EventLog } from 'web3-eth-contract'
import { GeneratorService } from './generator.service'

const globalVariable: any = global

globalVariable.isSyncingGetDataFromSmartContract = false

@Injectable()
export class SynchronizeService implements OnModuleInit {
  private logger = new Logger(SynchronizeService.name)

  constructor(
    private readonly prismaService: PrismaService,
    private readonly web3Service: Web3Service,
    private readonly generatorService: GeneratorService
  ) {}
  async onModuleInit() {
    await this.onJobGetDataFromSmartContract()
  }

  sortByTransactionIndex = (a: EventLog, b: EventLog) =>
    Number(a.transactionIndex) - Number(b.transactionIndex)

  async synchronizeNFT(
    lastBlockNumber: number,
    lastBlockNumberOnchain: number,
    listTxHash: string[]
  ) {
    const inkaraNftContract = this.web3Service.getInkaraNftContract(
      Network.EMERALD
    )

    const getPastEventsConfig = {
      fromBlock: lastBlockNumber,
      toBlock: lastBlockNumberOnchain
    }

    const eventNewNftCreated = await inkaraNftContract.getPastEvents(
      'allEvents',
      getPastEventsConfig
    )

    this.logger.log(
      `Synchronizing ${eventNewNftCreated.length} allEvents events`
    )

    const listNewNftCreated = eventNewNftCreated
      .sort(this.sortByTransactionIndex)
      .map((e: any) => ({
        user: e.returnValues.user,
        tokenId: e.returnValues.tokenId,
        transactionHash: e.transactionHash,
        blockNumber: e.blockNumber
      }))

    listTxHash.push(
      ...eventNewNftCreated.map((e: any) => e.returnValues.tokenId)
    )

    for (const newNftCreated of listNewNftCreated) {
      try {
        console.log(newNftCreated)
      } catch (error: any) {
        this.logger.error(`Cannot insert, error: ${error.message}`)
      }
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async onJobGetDataFromSmartContract() {
    console.log(await this.web3Service.getBlockNumber(Network.EMERALD))
    if (globalVariable.isSyncingGetDataFromSmartContract) return
    globalVariable.isSyncingGetDataFromSmartContract = true

    try {
      const lastSync = await this.prismaService.synchronize.findFirst({
        orderBy: { lastBlockNumber: 'desc' }
      })
      const lastBlockNumber = (lastSync?.lastBlockNumber || 0) + 1
      // if (!lastSync?.lastBlockNumber) {
      //   await this.prismaService.synchronize.create({
      //     id: this.generatorService.uuid(),
      //     txHash: '',
      //     lastBlockNumber: 33524081
      //   })
      //   globalVariable.isSyncingGetDataFromSmartContract = false
      //   return
      // }

      const lastBlockNumberOnchain = Math.min(
        Number(await this.web3Service.getBlockNumber(Network.EMERALD)),
        lastBlockNumber + 100
      )

      const listTxHash: string[] = []
      await this.synchronizeNFT(
        lastBlockNumber,
        lastBlockNumberOnchain,
        listTxHash
      )

      await this.prismaService.synchronize.create({
        data: {
          id: this.generatorService.uuid(),
          lastBlockNumber: lastBlockNumberOnchain,
          txHash: listTxHash.length > 0 ? listTxHash : []
        }
      })

      this.logger.log(`Synchronized ${listTxHash.length} transactions`)
    } catch (error) {
      this.logger.error(`onJobGetDataFromSmartContract: ${error.message}`)
    } finally {
      globalVariable.isSyncingGetDataFromSmartContract = false
    }
  }
}
