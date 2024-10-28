// listing.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { Network } from '@prisma/client'
import { IsString, IsEnum, IsNotEmpty } from 'class-validator'

export class ListingDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Unique identifier for the listing',
    example: 'listing_12345'
  })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'ID of the NFT being listed',
    example: 'nft_67890'
  })
  @IsString()
  @IsNotEmpty()
  nftId: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Transaction Hash for the listing',
    example: '0xdef456abc789...'
  })
  @IsString()
  @IsNotEmpty()
  txHash: string

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
