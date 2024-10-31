// collection.controller.ts

import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Collection, User } from '@prisma/client'
import { AccessTokenGuard } from '@common/guards'
import { CurrentUser, Public } from '@common/decorators'
import { onError, onSuccess, type Option } from '@common/response'
import { CollectionService } from '../services/collection.service'
import { CreateCollectionDto } from '../dto/create-collection.dto'
import { PaginationParams } from '@common/dto/pagenation-params.dto'
import { SearchParams } from '@common/dto/search-params.dto'
import { FilterParams } from '@common/dto/filter-params.dto'
import { SortParams } from '@common/dto/sort-params.dto'

const moduleName = 'collection'

@ApiTags(moduleName)
@Controller(moduleName)
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @ApiOperation({ summary: 'Find all collections' })
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getCollections(
    @Query() sort: SortParams,
    @Query() search: SearchParams,
    @Query() filter: FilterParams,
    @Query() pagination: PaginationParams
  ): Promise<Option<Collection[]>> {
    try {
      const res = await this.collectionService.getCollections(
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

  @ApiOperation({ summary: 'Find Collection by id' })
  @Public()
  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async getCollection(@Param('id') id: string): Promise<Option<any>> {
    try {
      const res = await this.collectionService.getCollection({ where: { id } })
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Get top collections' })
  @Public()
  @Get('top')
  @HttpCode(HttpStatus.OK)
  async getTopCollections(
    @Query() filter: FilterParams
  ): Promise<Option<Collection[]>> {
    try {
      const res = await this.collectionService.getTopCollections(filter)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Get notable collections' })
  @Get('notable')
  @HttpCode(HttpStatus.OK)
  async getNotableCollections(): Promise<Option<any>> {
    try {
      const res = await this.collectionService.getNotableCollections()
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Get featured collections' })
  @Get('feature')
  @HttpCode(HttpStatus.OK)
  async getFeaturedCollections(): Promise<Option<any>> {
    try {
      const res = await this.collectionService.getFeaturedCollections()
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Create collection', description: 'forbidden' })
  @ApiBody({ type: CreateCollectionDto })
  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async createCollection(
    @CurrentUser() user: User,
    @Body() data: CreateCollectionDto
  ): Promise<Option<any>> {
    try {
      const res = await this.collectionService.createCollection(user.id, data)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }
}
