// get-collections.response.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { Photo } from '@prisma/client'

export class GetCollectionsResponse {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'ID of the collection',
    example: 'collection_12345'
  })
  id: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Name of the collection',
    example: 'My Awesome Collection'
  })
  name: string

  @ApiProperty({
    required: true,
    type: 'object',
    description: 'Avatar of the collection',
    example: { id: 'photo_1', url: 'https://example.com/avatar.jpg' }
  })
  avatar: Photo

  @ApiProperty({
    required: true,
    type: 'object',
    description: 'Banner of the collection',
    example: { id: 'photo_2', url: 'https://example.com/banner.jpg' }
  })
  banner: Photo

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Description of the collection',
    example: 'This is a collection of awesome NFTs.'
  })
  desc: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Address of the collection',
    example: '0x1234567890abcdef1234567890abcdef12345678'
  })
  address: string

  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Total supply of NFTs in the collection',
    example: 1000
  })
  supply: number

  @ApiProperty({
    required: true,
    type: 'boolean',
    description: 'Whether the collection is verified',
    example: true
  })
  verified: boolean

  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Number of owners of the collection',
    example: 500
  })
  owners: number

  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Number of listed items in the collection',
    example: 200
  })
  listedItems: number

  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Number of sold items in the collection',
    example: 150
  })
  salesItems: number

  @ApiProperty({
    required: true,
    type: 'bigint',
    description: 'Floor price of the collection',
    example: 0
  })
  floorPrice: bigint

  @ApiProperty({
    required: true,
    type: 'bigint',
    description: 'Total volume of sales in the collection',
    example: 10000
  })
  volume: bigint
}
