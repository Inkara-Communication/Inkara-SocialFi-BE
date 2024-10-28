// accept-offer.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { Network } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class AcceptOfferDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'ID of the offer to be accepted'
  })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Transaction hash associated with the acceptance of the offer'
  })
  @IsString()
  @IsNotEmpty()
  txHash: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Network where the transaction is processed'
  })
  @IsEnum(Network)
  @IsNotEmpty()
  network: Network
}
