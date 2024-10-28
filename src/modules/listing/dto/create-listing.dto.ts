// create-listing.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { Network } from '@prisma/client'
import { IsString, IsEnum, IsNotEmpty } from 'class-validator'

export class CreateListingDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'ID of the NFT being listed'
  })
  @IsString()
  @IsNotEmpty()
  nftId: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Signature for the listing'
  })
  @IsString()
  @IsNotEmpty()
  signature: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Parameters related to the listing'
  })
  @IsString()
  @IsNotEmpty()
  parameters: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Network where the listing is made'
  })
  @IsEnum(Network)
  @IsNotEmpty()
  network: Network
}
