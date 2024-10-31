// like.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { CurrentUser } from '@common/decorators'
import { AccessTokenGuard } from '@common/guards'
import { onError, onSuccess, type Option } from '@common/response'
import { CreateLikeDto } from '../dto/create-like.dto'
import { LikeService } from '../services/like.service'
import { FilterParams } from '@common/dto/filter-params.dto'
import { PaginationParams } from '@common/dto/pagenation-params.dto'

const moduleName = 'like'

@ApiTags(moduleName)
@Controller(moduleName)
export class LikeController {
  constructor(private likeService: LikeService) {}

  // Nft Likes
  @ApiOperation({ summary: 'Get NFT likes by user', description: 'forbidden' })
  @UseGuards(AccessTokenGuard)
  @Get('nft')
  @HttpCode(HttpStatus.OK)
  async getNftLikesByUser(
    @CurrentUser() user: User,
    @Query() filter: FilterParams,
    @Query() pagination: PaginationParams
  ): Promise<Option<any>> {
    try {
      const res = await this.likeService.getNftLikesByUser(
        user.id,
        filter,
        pagination
      )
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({
    summary: 'Get like by user and nftId',
    description: 'forbidden'
  })
  @UseGuards(AccessTokenGuard)
  @Get('nft/:nftId')
  @HttpCode(HttpStatus.OK)
  async getNftLikeByUser(
    @Param('nftId') nftId: string,
    @CurrentUser() user: User
  ): Promise<Option<any>> {
    try {
      const res = await this.likeService.getNftLikeByUser(user.id, nftId)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Create new NFT like', description: 'forbidden' })
  @ApiBody({ type: CreateLikeDto })
  @UseGuards(AccessTokenGuard)
  @Post('nft')
  @HttpCode(HttpStatus.OK)
  async createNftLike(
    @CurrentUser() user: User,
    @Body() { nftId }: CreateLikeDto
  ): Promise<Option<any>> {
    try {
      const res = await this.likeService.createNftLike(user.id, nftId)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Delete NFT like', description: 'forbidden' })
  @UseGuards(AccessTokenGuard)
  @Delete('nft/:nftId')
  @HttpCode(HttpStatus.OK)
  async deleteNftLike(
    @Param('nftId') nftId: string,
    @CurrentUser() user: User
  ): Promise<Option<any>> {
    try {
      const res = await this.likeService.deleteNftLike(nftId, user.id)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  // Post Likes
  @ApiOperation({ summary: 'Get post likes by user', description: 'forbidden' })
  @UseGuards(AccessTokenGuard)
  @Get('post')
  @HttpCode(HttpStatus.OK)
  async getPostLikesByUser(
    @CurrentUser() user: User,
    @Query() filter: FilterParams,
    @Query() pagination: PaginationParams
  ): Promise<Option<any>> {
    try {
      const res = await this.likeService.getPostLikesByUser(
        user.id,
        filter,
        pagination
      )
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({
    summary: 'Get like by user and postId',
    description: 'forbidden'
  })
  @UseGuards(AccessTokenGuard)
  @Get('post/:postId')
  @HttpCode(HttpStatus.OK)
  async getPostLikeByUser(
    @Param('postId') postId: string,
    @CurrentUser() user: User
  ): Promise<Option<any>> {
    try {
      const res = await this.likeService.getPostLikeByUser(user.id, postId)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Create new post like', description: 'forbidden' })
  @ApiBody({ type: CreateLikeDto })
  @UseGuards(AccessTokenGuard)
  @Post('post')
  @HttpCode(HttpStatus.OK)
  async createPostLike(
    @CurrentUser() user: User,
    @Body() { postId }: CreateLikeDto
  ): Promise<Option<any>> {
    try {
      const res = await this.likeService.createPostLike(user.id, postId)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Delete post like', description: 'forbidden' })
  @UseGuards(AccessTokenGuard)
  @Delete('post/:postId')
  @HttpCode(HttpStatus.OK)
  async deletePostLike(
    @Param('postId') postId: string,
    @CurrentUser() user: User
  ): Promise<Option<any>> {
    try {
      const res = await this.likeService.deletePostLike(postId, user.id)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }
}
