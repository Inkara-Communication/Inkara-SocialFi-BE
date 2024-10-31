// listing.controller.ts

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser, Public } from '@common/decorators'
import { AccessTokenGuard } from '@common/guards'
import { onError, onSuccess, type Option } from '@common/response'
import { ListingStatus, User } from '@prisma/client'
import { CreateListingDto } from '../dto/create-listing.dto'
import { ListingService } from '../services/listing.service'
import { ListingDto } from '../dto/listing.dto'
import { PaginationParams } from '@common/dto/pagenation-params.dto'

const moduleName = 'listing'

@ApiTags(moduleName)
@Controller(moduleName)
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @ApiOperation({ summary: 'Get all listings' })
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllListings(): Promise<Option<any>> {
    try {
      const res = this.listingService.getListings({
        where: { status: ListingStatus.ACTIVE },
        include: {
          seller: true,
          nft: {
            include: {
              owner: true
            }
          }
        }
      })
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Get listings by user', description: 'forbidden' })
  @UseGuards(AccessTokenGuard)
  @Get('user')
  @HttpCode(HttpStatus.OK)
  async getUserListings(
    @CurrentUser() user: User,
    @Query() pagination: PaginationParams
  ): Promise<Option<any>> {
    try {
      const res = await this.listingService.getLisitingsByUser(
        user.id,
        pagination
      )
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Get listing by nft id', description: 'public' })
  @Public()
  @Get('nft/:id')
  async getListingsByNftId(@Param('id') id: string): Promise<Option<any>> {
    try {
      const res = this.listingService.getListing({
        where: { nftId: id, status: ListingStatus.ACTIVE }
      })
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Get listing by id' })
  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getListingById(@Param('id') id: string): Promise<Option<any>> {
    try {
      const res = this.listingService.getListing({
        where: { id, status: ListingStatus.ACTIVE }
      })
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'List nft', description: 'forbidden' })
  @ApiBody({ type: CreateListingDto })
  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async createListing(
    @CurrentUser() user: User,
    @Body() data: CreateListingDto
  ): Promise<Option<any>> {
    try {
      const res = this.listingService.createListing(user.id, data)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Cancel nft', description: 'forbidden' })
  @ApiBody({ type: ListingDto })
  @UseGuards(AccessTokenGuard)
  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  async cancelListing(
    @CurrentUser() user: User,
    @Body() data: ListingDto
  ): Promise<Option<any>> {
    try {
      const res = this.listingService.cancelListing(user.id, data)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Buy nft', description: 'forbidden' })
  @ApiBody({ type: ListingDto })
  @UseGuards(AccessTokenGuard)
  @Post('buy')
  async buyListing(
    @CurrentUser() user: User,
    @Body() data: ListingDto
  ): Promise<Option<any>> {
    try {
      const res = this.listingService.buyListing(user.id, data)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }
}
