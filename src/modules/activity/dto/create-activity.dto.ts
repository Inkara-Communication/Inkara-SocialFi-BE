// create-activity.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class CreateActivityDto {
  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Buyer ID'
  })
  @IsString()
  buyerId?: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Listing ID'
  })
  @IsString()
  listingId: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'NFT ID'
  })
  @IsString()
  nftId: string

  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Activity price'
  })
  @IsNumber()
  activityPrice: number
}
