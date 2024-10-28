// get-collections.response.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { Photo } from '@prisma/client'

export class GetCollectionsResponse {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'ID of the collection'
  })
  id: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Name of the collection'
  })
  name: string

  @ApiProperty({
    required: true,
    type: 'object',
    description: 'Avatar of the collection'
  })
  avatar: Photo

  @ApiProperty({
    required: true,
    type: 'object',
    description: 'Banner of the collection'
  })
  banner: Photo

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Description of the collection'
  })
  desc: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Address of the collection'
  })
  address: string

  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Total supply of NFTs in the collection'
  })
  supply: number

  @ApiProperty({
    required: true,
    type: 'boolean',
    description: 'Whether the collection is verified'
  })
  verified: boolean

  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Number of owners of the collection'
  })
  owners: number

  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Number of listed items in the collection'
  })
  listedItems: number

  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Number of sold items in the collection'
  })
  salesItems: number

  @ApiProperty({
    required: true,
    type: 'bigint',
    description: 'Floor price of the collection'
  })
  floorPrice: bigint

  @ApiProperty({
    required: true,
    type: 'bigint',
    description: 'Total volume of sales in the collection'
  })
  volume: bigint
}
