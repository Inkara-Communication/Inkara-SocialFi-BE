// create-collection.controller.ts

import { ApiProperty } from '@nestjs/swagger'
import { Network } from '@prisma/client'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateCollectionDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Collection name',
    example: 'My Unique Collection'
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Collection address',
    example: '0x1234567890abcdef1234567890abcdef12345678'
  })
  @IsString()
  @IsNotEmpty()
  address: string

  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Total supply',
    example: 1000
  })
  @IsNumber()
  @IsNotEmpty()
  supply: number

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Avatar id',
    example: 'avatar-12345'
  })
  @IsString()
  @IsOptional()
  avatarId?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Banner id',
    example: 'banner-67890'
  })
  @IsString()
  @IsOptional()
  bannerId?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Collection description',
    example: 'This collection features unique artworks and collectibles.'
  })
  @IsString()
  @IsOptional()
  desc?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Website url',
    example: 'https://mycollection.com'
  })
  @IsString()
  @IsOptional()
  website?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Twitter url',
    example: 'https://twitter.com/mycollection'
  })
  @IsString()
  @IsOptional()
  twitter?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Discord url',
    example: 'https://discord.gg/mycollection'
  })
  @IsString()
  @IsOptional()
  discord?: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Network',
    example: 'EMERALD'
  })
  @IsString()
  @IsNotEmpty()
  network: Network
}
