// create-notification.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { NotificationType } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateNotificationDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'ID of the activity related to the notification',
    example: 'activity_12345'
  })
  @IsString()
  @IsNotEmpty()
  activityId: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Type of notification',
    example: 'NEW_LIKE'
  })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType
}
