// activity.controller.ts

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from '@common/decorators'
import { onError, onSuccess, type Option } from '@common/response'
import { ActivityType } from '@prisma/client'
import { ActivityService } from '../services/activity.service'
import { FilterParams } from '@common/dto/filter-params.dto'
import { PaginationParams } from '@common/dto/pagenation-params.dto'

const moduleName = 'activity'

@ApiTags(moduleName)
@Controller(moduleName)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @ApiOperation({ summary: 'Get activities by user' })
  @Public()
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async getUserActivities(
    @Param('userId') userId: string,
    @Query() filter: FilterParams,
    @Query() pagination: PaginationParams
  ): Promise<Option<any>> {
    try {
      const res = await this.activityService.getActivitiesByUser(
        userId,
        filter,
        pagination
      )
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({
    summary: 'Get activities of collection',
    description: 'public'
  })
  @Public()
  @Get('collection/:collectionId')
  @HttpCode(HttpStatus.OK)
  async getCollectionActivities(
    @Param('collectionId') collectionId: string
  ): Promise<Option<any>> {
    try {
      const res = await this.activityService.getActivities({
        where: {
          nft: {
            collectionId
          },
          OR: [
            { actionType: ActivityType.SOLD },
            { actionType: ActivityType.ACCPETED_OFFER }
          ]
        }
      })
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Get activities of NFT', description: 'public' })
  @Public()
  @Get('nft/:nftId')
  @HttpCode(HttpStatus.OK)
  async getNftActivities(@Param('nftId') nftId: string): Promise<Option<any>> {
    try {
      const res = await this.activityService.getActivities({
        where: {
          nftId
        }
      })
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }
}
