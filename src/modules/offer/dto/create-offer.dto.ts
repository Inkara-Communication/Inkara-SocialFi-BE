// create-offer.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { Network } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateOfferDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'ID of the NFT'
  })
  @IsString()
  @IsNotEmpty()
  nftId: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Transaction signature for validation'
  })
  @IsString()
  @IsNotEmpty()
  signature: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Parameters for the offer'
  })
  @IsString()
  @IsNotEmpty()
  parameters: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Network where the transaction takes place'
  })
  @IsEnum(Network)
  @IsNotEmpty()
  network: Network
}
