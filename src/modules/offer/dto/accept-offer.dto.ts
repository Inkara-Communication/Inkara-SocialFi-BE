// accept-offer.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { Network } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class AcceptOfferDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'ID of the offer to be accepted',
    example: 'offer_67890'
  })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Transaction hash associated with the acceptance of the offer',
    example:
      '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  })
  @IsString()
  @IsNotEmpty()
  txHash: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Network where the transaction is processed',
    example: 'EMERALD'
  })
  @IsEnum(Network)
  @IsNotEmpty()
  network: Network
}
