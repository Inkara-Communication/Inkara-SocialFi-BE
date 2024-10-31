// notification.controller.ts

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Post,
  UseGuards
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { CurrentUser } from '@common/decorators'
import { AccessTokenGuard } from '@common/guards'
import { onError, onSuccess, type Option } from '@common/response'
import { NotificationService } from '../services/notification.service'
import { UpdateNotificationsDto } from '../dto/read-notification.dto'

const moduleName = 'notification'

@ApiTags(moduleName)
@Controller(moduleName)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({
    summary: 'Get notifications by user',
    description: 'forbidden'
  })
  @UseGuards(AccessTokenGuard)
  @Get('user')
  @HttpCode(HttpStatus.OK)
  async getUserNotifications(@CurrentUser() user: User): Promise<Option<any>> {
    try {
      const res = await this.notificationService.getNotificationsByUser(user.id)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Read notification', description: 'forbidden' })
  @ApiBody({
    type: UpdateNotificationsDto
  })
  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async markAsReadNotification(
    @CurrentUser() actor: User,
    @Body() data: UpdateNotificationsDto
  ): Promise<Option<any>> {
    try {
      const res = this.notificationService.readNotification(actor.id, data)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }
}
