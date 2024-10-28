// create-offer.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { Network } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateOfferDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'ID of the NFT',
    example: 'nft_67890'
  })
  @IsString()
  @IsNotEmpty()
  nftId: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Transaction signature for validation',
    example: '0x123abc...'
  })
  @IsString()
  @IsNotEmpty()
  signature: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Parameters for the offer',
    example: '{"price": "0.05", "expiresAt": "2024-10-30T00:00:00Z"}'
  })
  @IsString()
  @IsNotEmpty()
  parameters: string

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
