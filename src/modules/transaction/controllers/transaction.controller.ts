// notification.controller.ts

import { Controller, HttpCode, HttpStatus, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { onError, onSuccess, type Option } from '@common/response'
import { TransactionService } from '../services/transaction.service'

const moduleName = 'transaction'

@ApiTags(moduleName)
@Controller(moduleName)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({
    summary: 'Get transaction detail',
    description: 'forbidden'
  })
  @Get('transaction')
  @HttpCode(HttpStatus.OK)
  async getTransactionDetail(
    @Query('transactionHash') transactionHash: string
  ): Promise<Option<any>> {
    try {
      const res = await this.transactionService.getTransactionDetail(
        transactionHash
      )
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({
    summary: 'Get transaction receipt',
    description: 'forbidden'
  })
  @Get('transaction-receipt')
  @HttpCode(HttpStatus.OK)
  async getTransactionReceipt(
    @Query('transactionHash') transactionHash: string
  ): Promise<Option<any>> {
    try {
      const res = await this.transactionService.getTransactionReceipt(
        transactionHash
      )
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({
    summary: 'Get block number',
    description: 'forbidden'
  })
  @Get('block-number')
  @HttpCode(HttpStatus.OK)
  async getBlockNumber(): Promise<Option<any>> {
    try {
      const res = await this.transactionService.getBlockNumber()
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({
    summary: 'Get balance',
    description: 'forbidden'
  })
  @Get('balance')
  @HttpCode(HttpStatus.OK)
  async getBalance(@Query('address') address: string): Promise<Option<any>> {
    try {
      const res = await this.transactionService.getBalance(address)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({
    summary: 'Get allowance',
    description: 'forbidden'
  })
  @Get('allowance')
  @HttpCode(HttpStatus.OK)
  async getAllowance(
    @Query('address') address: string,
    @Query('spender') spender: string
  ): Promise<Option<any>> {
    try {
      const res = await this.transactionService.getAllowance(address, spender)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }
}
