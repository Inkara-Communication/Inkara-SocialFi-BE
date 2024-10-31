// hide.controller.ts

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
import { FilterParams } from '@common/dto/filter-params.dto'
import { PaginationParams } from '@common/dto/pagenation-params.dto'
import { CreateHideDto } from '../dto/create-hide.dto'
import { HideService } from '../services/hide.service'

const moduleName = 'hide'

@ApiTags(moduleName)
@Controller(moduleName)
export class HideController {
  constructor(private hideService: HideService) {}

  @ApiOperation({ summary: 'Get hides by user', description: 'forbidden' })
  @UseGuards(AccessTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getHidesByUser(
    @CurrentUser() user: User,
    @Query() filter: FilterParams,
    @Query() pagination: PaginationParams
  ): Promise<Option<any>> {
    try {
      const res = await this.hideService.getHidesByUser(
        user.id,
        filter,
        pagination
      )
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Create new hide', description: 'forbidden' })
  @ApiBody({ type: CreateHideDto })
  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async createHide(
    @CurrentUser() user: User,
    @Body() { nftId }: CreateHideDto
  ): Promise<Option<any>> {
    try {
      const res = await this.hideService.createHide(user.id, nftId)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Delete hide', description: 'forbidden' })
  @UseGuards(AccessTokenGuard)
  @Delete(':nftId')
  @HttpCode(HttpStatus.OK)
  async deleteHide(
    @Param('nftId') nftId: string,
    @CurrentUser() user: User
  ): Promise<Option<any>> {
    try {
      const res = await this.hideService.deleteHide(nftId, user.id)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }
}
