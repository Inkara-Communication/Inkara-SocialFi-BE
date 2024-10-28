// create-activity.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class CreateActivityDto {
  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Buyer ID',
    example: 'user-12345'
  })
  @IsString()
  buyerId?: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Listing ID',
    example: 'listing-54321'
  })
  @IsString()
  listingId: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'NFT ID',
    example: 'nft-98765'
  })
  @IsString()
  nftId: string

  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Activity price',
    example: 150
  })
  @IsNumber()
  activityPrice: number
}
