// create-listing.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { Network } from '@prisma/client'
import { IsString, IsEnum, IsNotEmpty } from 'class-validator'

export class CreateListingDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'ID of the NFT being listed',
    example: 'nft_12345'
  })
  @IsString()
  @IsNotEmpty()
  nftId: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Signature for the listing',
    example: '0xabc123def456...'
  })
  @IsString()
  @IsNotEmpty()
  signature: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Parameters related to the listing',
    example: '{"price": "0.05", "duration": "3600"}'
  })
  @IsString()
  @IsNotEmpty()
  parameters: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Network where the listing is made',
    example: 'EMERALD'
  })
  @IsEnum(Network)
  @IsNotEmpty()
  network: Network
}
