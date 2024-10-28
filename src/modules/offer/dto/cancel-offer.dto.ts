// cancel-offer.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { Network } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CancelOfferDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'ID of the offer to cancel',
    example: 'offer_12345'
  })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Network where the transaction takes place',
    example: 'EMERALD'
  })
  @IsEnum(Network)
  @IsNotEmpty()
  network: Network
}
