import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Web3Service } from './web3.service'
import { EventLog } from 'web3-eth-contract'
import { GeneratorService } from './generator.service'

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
    } catch (error) {
      this.logger.error(`onJobGetDataFromSmartContract: ${error.message}`)
    } finally {
      globalVariable.isSyncingGetDataFromSmartContract = false
    }
  }
}
