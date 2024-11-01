// nft.controller.ts

import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Query
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { NftService } from '../services/nft.service'
import { CreateNftDto } from '../dto/create-nft.dto'
import { CurrentUser, Public } from '@common/decorators'
import { AccessTokenGuard } from '@common/guards'
import { onError, onSuccess, type Option } from '@common/response'
import { GetNftDto, PaginationDto } from '../dto/get-nft.dto'
import { User } from '@prisma/client'
import { PaginationParams } from '@common/dto/pagenation-params.dto'
import { SearchParams } from '@common/dto/search-params.dto'
import { SortParams } from '@common/dto/sort-params.dto'
import { FilterParams } from '@common/dto/filter-params.dto'

const moduleName = 'nft'

@ApiTags(moduleName)
@Controller(moduleName)
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @ApiOperation({ summary: 'Find all nfts by collection id' })
  @Public()
  @Get('collection/:collectionId')
  @HttpCode(HttpStatus.OK)
  async getNftsByCollection(
    @Param('collectionId') collectionId: string,
    @Query() sort: SortParams,
    @Query() search: SearchParams,
    @Query() pagination: PaginationParams
  ): Promise<Option<any>> {
    try {
      const res = await this.nftService.getNftsByCollection(
        collectionId,
        sort,
        search,
        pagination
      )
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Find all nfts by user id' })
  @Public()
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async getNftsByUser(
    @Param('userId') userId: string,
    @Query() sort: SortParams,
    @Query() search: SearchParams,
    @Query() filter: FilterParams,
    @Query() pagination: PaginationParams
  ): Promise<Option<any>> {
    try {
      const res = await this.nftService.getNftsByUser(
        userId,
        sort,
        search,
        filter,
        pagination
      )
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Find all nfts by user token' })
  @ApiBody({ type: CreateNftDto })
  @UseGuards(AccessTokenGuard)
  @Post('user')
  @HttpCode(HttpStatus.OK)
  async getNftsByUserToken(
    @CurrentUser() user: User,
    @Body() { sort, search, pagination, filter }: PaginationDto
  ): Promise<Option<any>> {
    try {
      const res = await this.nftService.getNftsByUser(
        user.id,
        sort,
        search,
        filter,
        pagination
      )
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Find all nfts user owned' })
  @Public()
  @Get('owner/:userId')
  @HttpCode(HttpStatus.OK)
  async getOwnedNfts(@Param('userId') userId: string): Promise<Option<any>> {
    try {
      const res = await this.nftService.getNfts({ where: { ownerId: userId } })
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({
    summary: 'Find all nfts user minted'
  })
  @Public()
  @Get('minter/:userId')
  @HttpCode(HttpStatus.OK)
  async getCreatedNfts(@Param('userId') userId: string): Promise<Option<any>> {
    try {
      const res = await this.nftService.getNfts({ where: { minterId: userId } })
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({
    summary: 'Find nft'
  })
  @ApiBody({ type: GetNftDto })
  @Public()
  @Post('nft-detail')
  @HttpCode(HttpStatus.OK)
  async getNft(@Body() data: GetNftDto): Promise<Option<any>> {
    try {
      const res = await this.nftService.getNft(data)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Create new nft', description: 'forbidden' })
  @ApiBody({ type: CreateNftDto })
  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async createNft(
    @CurrentUser() user: User,
    @Body() createNftDto: CreateNftDto
  ): Promise<Option<any>> {
    try {
      const res = await this.nftService.createNft(user.id, createNftDto)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }
}
