// user.controller.ts

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser, Public } from '@common/decorators'
import { AccessTokenGuard } from '@common/guards'
import { onError, onSuccess, type Option } from '@common/response'
import { IPayloadUserJwt } from '@common/interfaces'
import { UpdateUsernameDto } from '@modules/user/dto/update-username.dto'
import { UserService } from '@modules/user/services/user.service'
import { User } from '@prisma/client'
import { SearchParams } from '@common/dto/search-params.dto'

const moduleName = 'user'

@ApiTags(moduleName)
@Controller(moduleName)
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get me' })
  @UseGuards(AccessTokenGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@CurrentUser() user: User): Promise<Option<any>> {
    try {
      const res = await this.userService.getUser({
        where: { id: user.id },
        include: {
          profile: true
        }
      })
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Find all users' })
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(@Query() { contains }: SearchParams): Promise<Option<User[]>> {
    try {
      const res = this.userService.getManyUsers({
        where: {
          username: { contains: contains ? contains.slice(0, 2) : undefined }
        },
        include: {
          profile: true
        },
        take: 4
      })
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Get user by id' })
  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Option<any>> {
    try {
      const res = await this.userService.getUser({
        where: { id },
        include: {
          profile: true
        }
      })
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Update username' })
  @ApiBody({ type: UpdateUsernameDto })
  @UseGuards(AccessTokenGuard)
  @Patch('update-username')
  @HttpCode(HttpStatus.OK)
  async updateUsername(
    @CurrentUser() payload: IPayloadUserJwt,
    @Body() data: UpdateUsernameDto
  ): Promise<Option<any>> {
    try {
      const res = await this.userService.updateUsername(payload.id, data)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Can I use this username?' })
  @ApiBody({ type: UpdateUsernameDto })
  @Public()
  @Post('available-username')
  @HttpCode(HttpStatus.OK)
  async availableUsername(
    @Body() data: UpdateUsernameDto
  ): Promise<Option<any>> {
    try {
      const res = await this.userService.availableUsername(data)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }
}
