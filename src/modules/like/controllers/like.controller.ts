// like.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { CurrentUser } from '@common/decorators'
import { AccessTokenGuard } from '@common/guards'
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
  async getNftLikesByUser(
    @CurrentUser() user: User,
    @Query() filter: FilterParams,
    @Query() pagination: PaginationParams
  ) {
    return await this.likeService.getNftLikesByUser(user.id, filter, pagination)
  }

  @ApiOperation({
    summary: 'Get like by user and nftId',
    description: 'forbidden'
  })
  @UseGuards(AccessTokenGuard)
  @Get('nft/:nftId')
  async getNftLikeByUser(
    @Param('nftId') nftId: string,
    @CurrentUser() user: User
  ) {
    return await this.likeService.getNftLikeByUser(user.id, nftId)
  }

  @ApiOperation({ summary: 'Create new NFT like', description: 'forbidden' })
  @ApiBody({ type: CreateLikeDto })
  @UseGuards(AccessTokenGuard)
  @Post('nft')
  async createNftLike(
    @CurrentUser() user: User,
    @Body() { nftId }: CreateLikeDto
  ) {
    return await this.likeService.createNftLike(user.id, nftId)
  }

  @ApiOperation({ summary: 'Delete NFT like', description: 'forbidden' })
  @UseGuards(AccessTokenGuard)
  @Delete('nft/:nftId')
  async deleteNftLike(
    @Param('nftId') nftId: string,
    @CurrentUser() user: User
  ) {
    return await this.likeService.deleteNftLike(nftId, user.id)
  }

  // Post Likes
  @ApiOperation({ summary: 'Get post likes by user', description: 'forbidden' })
  @UseGuards(AccessTokenGuard)
  @Get('post')
  async getPostLikesByUser(
    @CurrentUser() user: User,
    @Query() filter: FilterParams,
    @Query() pagination: PaginationParams
  ) {
    return await this.likeService.getPostLikesByUser(
      user.id,
      filter,
      pagination
    )
  }

  @ApiOperation({
    summary: 'Get like by user and postId',
    description: 'forbidden'
  })
  @UseGuards(AccessTokenGuard)
  @Get('post/:postId')
  async getPostLikeByUser(
    @Param('postId') postId: string,
    @CurrentUser() user: User
  ) {
    return await this.likeService.getPostLikeByUser(user.id, postId)
  }

  @ApiOperation({ summary: 'Create new post like', description: 'forbidden' })
  @ApiBody({ type: CreateLikeDto })
  @UseGuards(AccessTokenGuard)
  @Post('post')
  async createPostLike(
    @CurrentUser() user: User,
    @Body() { postId }: CreateLikeDto
  ) {
    return await this.likeService.createPostLike(user.id, postId)
  }

  @ApiOperation({ summary: 'Delete post like', description: 'forbidden' })
  @UseGuards(AccessTokenGuard)
  @Delete('post/:postId')
  async deletePostLike(
    @Param('postId') postId: string,
    @CurrentUser() user: User
  ) {
    return await this.likeService.deletePostLike(postId, user.id)
  }
}
