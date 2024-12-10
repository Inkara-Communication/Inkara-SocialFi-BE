import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Web3Service } from './web3.service'
import { EventLog } from 'web3-eth-contract'
import { GeneratorService } from './generator.service'
import { Network } from '@prisma/client'

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

  async fetchLastBlockForNetwork(network: Network): Promise<number> {
    let syncRecord = await this.prismaService.synchronize.findFirst({
      where: { network }
    })
    if (!syncRecord) {
      syncRecord = await this.prismaService.synchronize.create({
        data: { network, lastBlock: 169976741 }
      })
    }
    return syncRecord.lastBlock
  }

  async updateLastBlockForNetwork(
    network: Network,
    lastBlock: number
  ): Promise<void> {
    await this.prismaService.synchronize.upsert({
      where: { network },
      update: { lastBlock },
      create: { network, lastBlock }
    })
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async onJobGetDataFromSmartContract() {
    if (globalVariable.isSyncingGetDataFromSmartContract) return
    globalVariable.isSyncingGetDataFromSmartContract = true

    try {
    } catch (error) {
      this.logger.error(`onJobGetDataFromSmartContract: ${error.message}`)
    } finally {
      globalVariable.isSyncingGetDataFromSmartContract = false
    }
  }
}
