// profile.controller.ts

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Patch,
  UseGuards
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser, Public } from '@common/decorators'
import { AccessTokenGuard } from '@common/guards'
import { onError, onSuccess, type Option } from '@common/response'
import { User } from '@prisma/client'
import { UpdateProfileDto } from '../dto/update-profile.dto'
import { ProfileService } from '../services'

const moduleName = 'profile'

@ApiTags(moduleName)
@Controller(moduleName)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateProfileDto })
  @UseGuards(AccessTokenGuard)
  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @CurrentUser() user: User,
    @Body() profileDto: UpdateProfileDto
  ): Promise<Option<any>> {
    try {
      const res = this.profileService.updateProfile(user.id, profileDto)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Get profile', description: 'forbidden' })
  @UseGuards(AccessTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getProfile(@CurrentUser() user: User): Promise<Option<any>> {
    try {
      const res = this.profileService.getProfile({
        where: { userId: user.id },
        include: {
          avatar: true
        }
      })
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Get profile by id' })
  @Public()
  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async getProfileById(@Param('userId') userId: string): Promise<Option<any>> {
    try {
      const res = this.profileService.getProfile({
        where: { userId },
        include: {
          avatar: true
        }
      })
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }
}
