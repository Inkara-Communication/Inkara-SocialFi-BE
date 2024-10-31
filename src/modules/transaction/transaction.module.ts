import { Module } from '@nestjs/common'
import { TransactionService } from './services/transaction.service'
import { TransactionController } from './controllers/transaction.controller'
@Module({
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}
