// notification.controller.ts

import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Post,
  Body
} from '@nestjs/common'
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { onError, onSuccess, type Option } from '@common/response'
import { TransactionService } from '../services/transaction.service'
import { CreateSignatureDto } from '../dto/create-signature.dto'
import { signMessageDto } from '../dto/sign-message.dto'

const moduleName = 'transaction'

@ApiTags(moduleName)
@Controller(moduleName)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({
    summary: 'Create signature data',
    description: 'forbidden'
  })
  @ApiBody({ type: CreateSignatureDto })
  @ApiOkResponse({
    description: 'Example of api response',
    schema: {
      example: {
        data: {
          messageHash:
            '0xf96fe01583afc14e8eb0b43c4f7cecb320fe13a4db9fb7f66bc205b7623daa5b',
          v: '0x37948',
          r: '0x2bffa91cf196e7e5cdbbb251957c642e46ef89796711b4ebf2a277b37246e47',
          s: '0x629dec7401446416f9a4703828b22251df3a93515af00537a5f106f7ced98eee',
          rawTransaction:
            '0xf88c428507731940008307a121941767f854ed4f4f6ae3d5746aa2b857a14c0bbf4f80a44b306a6100000000000000000000000021cd1832c48247c3f3a72b8629cb1ca3e8dd69a373027128a002bfff91cf499e7e5cdbbb261957c642e46ef99796715b4ebf2d177437249e47a0619dec7401446426f9b4703828b22251cd5a93515af00537a8f106f7ced58eee',
          transactionHash:
            '0xae20469816b9b5db25b35841327d7b736c315f17ee8785325317e1d44d40c1a2'
        },
        success: true,
        message: 'Success',
        count: 1
      }
    }
  })
  @Post('create-signature')
  @HttpCode(HttpStatus.OK)
  async createSignature(
    @Body() data: CreateSignatureDto
  ): Promise<Option<any>> {
    try {
      const res = await this.transactionService.createSignature(data)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({
    summary: 'sign message data',
    description: 'forbidden'
  })
  @ApiBody({ type: signMessageDto })
  @ApiOkResponse({
    description: 'Example of api response',
    schema: {
      example: {
        data: {
          messageHash:
            '0xf96fe01583afc14e8eb0b43c4f7cecb320fe13a4db9fb7f66bc205b7623daa5b',
          v: '0x37948',
          r: '0x2bffa91cf196e7e5cdbbb251957c642e46ef89796711b4ebf2a277b37246e47',
          s: '0x629dec7401446416f9a4703828b22251df3a93515af00537a5f106f7ced98eee',
          rawTransaction:
            '0xf88c428507731940008307a121941767f854ed4f4f6ae3d5746aa2b857a14c0bbf4f80a44b306a6100000000000000000000000021cd1832c48247c3f3a72b8629cb1ca3e8dd69a373027128a002bfff91cf499e7e5cdbbb261957c642e46ef99796715b4ebf2d177437249e47a0619dec7401446426f9b4703828b22251cd5a93515af00537a8f106f7ced58eee',
          transactionHash:
            '0xae20469816b9b5db25b35841327d7b736c315f17ee8785325317e1d44d40c1a2'
        },
        success: true,
        message: 'Success',
        count: 1
      }
    }
  })
  @Post('message-signature')
  @HttpCode(HttpStatus.OK)
  async signMessage(@Body() data: signMessageDto): Promise<Option<any>> {
    try {
      const res = await this.transactionService.signMessage(data)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({
    summary: 'Get transaction detail',
    description: 'forbidden'
  })
  @ApiOkResponse({
    description: 'Example of api response',
    schema: {
      example: {
        data: {
          blockHash:
            '0x2875bf627e038bef9cbdabb02bffddce1e68b5402cedcff3ee8ed11dcb9dfbb3',
          blockNumber: '8517500',
          from: '0x5d5510e8f017b167266005d7c6f327e6b39137c3',
          gas: '30000',
          gasPrice: '100000000000',
          maxFeePerGas: '100000000000',
          maxPriorityFeePerGas: '100000000000',
          hash: '0x0341967457413039c001a22beba2f60ab3002fc6867b3d1c1bfb8de777b882c2',
          input: '0x',
          nonce: '805316',
          to: '0x6d5a9a4c063b840ef3fe792e5dd6232fbf2c0982',
          transactionIndex: '0',
          value: '100000001730361510',
          type: '0',
          chainId: '42261',
          v: '84558',
          r: '0x773222c01d90dce82ca5f28fb9709249080a7c23563f5cc261f73c9473448325',
          s: '0x47d20c0c73b3e78f6bce00020bdc1c5523f3f43ea7e20fc7c1d762c650854841',
          data: '0x'
        },
        success: true,
        message: 'Success',
        count: 1
      }
    }
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
  @ApiOkResponse({
    description: 'Example of api response',
    schema: {
      example: {
        data: {
          blockHash:
            '0x2875bf627e038bef9cbdabb02bffddce1e68b5402cedcff3ee8ed11dcb9dfbb3',
          blockNumber: '8517500',
          cumulativeGasUsed: '22144',
          effectiveGasPrice: '100000000000',
          from: '0x5D5510e8F017b167266005d7c6f327e6b39137c3',
          gasUsed: '22144',
          logs: [],
          logsBloom:
            '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          status: '1',
          to: '0x6d5A9A4C063b840ef3fe792E5DD6232fbf2c0982',
          transactionHash:
            '0x0341967457413039c001a22beba2f60ab3002fc6867b3d1c1bfb8de777b882c2',
          transactionIndex: '0',
          type: '0'
        },
        success: true,
        message: 'Success',
        count: 1
      }
    }
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
  @ApiOkResponse({
    description: 'Example of api response',
    schema: {
      example: {
        data: '8528695',
        success: true,
        message: 'Success',
        count: 1
      }
    }
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
  @ApiOkResponse({
    description: 'Example of api response',
    schema: {
      example: {
        data: '117492155200000000000',
        success: true,
        message: 'Success',
        count: 1
      }
    }
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
  @ApiOkResponse({
    description: 'Example of api response',
    schema: {
      example: {
        data: '100000000000000000000',
        success: true,
        message: 'Success',
        count: 1
      }
    }
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
