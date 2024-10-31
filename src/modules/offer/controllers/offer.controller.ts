// offer.controller.ts

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { CurrentUser, Public } from '@common/decorators'
import { AccessTokenGuard } from '@common/guards'
import { onError, onSuccess, type Option } from '@common/response'
import { FilterParams } from '@common/dto/filter-params.dto'
import { PaginationParams } from '@common/dto/pagenation-params.dto'
import { OfferService } from '../services/offer.service'
import { CreateOfferDto } from '../dto/create-offer.dto'
import { CancelOfferDto } from '../dto/cancel-offer.dto'
import { AcceptOfferDto } from '../dto/accept-offer.dto'

const moduleName = 'offer'

@ApiTags(moduleName)
@Controller(moduleName)
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @ApiOperation({
    summary: 'Get NFT offer by id'
  })
  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOfferById(@Param('id') id: string): Promise<Option<any>> {
    try {
      const res = this.offerService.getOffer({
        where: {
          id
        },
        include: {
          nft: true,
          seller: true,
          buyer: true
        }
      })
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({
    summary: 'Get NFT offers by nft id'
  })
  @Public()
  @Get('nft/:nftId')
  @HttpCode(HttpStatus.OK)
  async getOffersByNft(@Param('nftId') nftId: string): Promise<Option<any>> {
    try {
      const res = await this.offerService.getOffers({
        where: {
          nftId
        },
        include: {
          buyer: true
        }
      })
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Get offers by user', description: 'forbidden' })
  @UseGuards(AccessTokenGuard)
  @Get('user')
  @HttpCode(HttpStatus.OK)
  async getUserListings(
    @CurrentUser() user: User,
    @Query() filter: FilterParams,
    @Query() pagination: PaginationParams
  ): Promise<Option<any>> {
    try {
      const res = await this.offerService.getOffersByUser(
        user.id,
        filter,
        pagination
      )
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Create new offer', description: 'forbidden' })
  @ApiBody({ type: CreateOfferDto })
  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async createOffer(
    @CurrentUser() actor: User,
    @Body() data: CreateOfferDto
  ): Promise<Option<any>> {
    try {
      const res = this.offerService.createOffer(actor.id, data)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Cancel offer', description: 'forbidden' })
  @ApiBody({ type: CancelOfferDto })
  @UseGuards(AccessTokenGuard)
  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  async cancelOffer(
    @CurrentUser() actor: User,
    @Body() data: CancelOfferDto
  ): Promise<Option<any>> {
    try {
      const res = this.offerService.cancelOffer(actor.id, data)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Accept offer', description: 'forbidden' })
  @ApiBody({ type: AcceptOfferDto })
  @UseGuards(AccessTokenGuard)
  @Post('accept')
  @HttpCode(HttpStatus.OK)
  async acceptOffer(
    @CurrentUser() actor: User,
    @Body() data: AcceptOfferDto
  ): Promise<Option<any>> {
    try {
      const res = this.offerService.acceptOffer(actor.id, data)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }
}
