// update-profile.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { OfferToken } from '@prisma/client'
import { IsOptional, IsString, IsBoolean } from 'class-validator'

export class AvatarDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'URL of the avatar image',
    example: 'https://example.com/avatar.jpg'
  })
  @IsString()
  url!: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Mint ID of the avatar',
    example: 'mint_12345'
  })
  @IsString()
  mintId!: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Link to the avatar',
    example: 'https://example.com/avatar-link'
  })
  @IsString()
  link!: string

  @ApiProperty({
    required: true,
    type: 'boolean',
    description: 'Whether the avatar is verified',
    example: true
  })
  @IsBoolean()
  verified!: boolean
}

export class UpdateProfileDto {
  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Bio of the user',
    example: 'I am a passionate NFT collector.'
  })
  @IsString()
  @IsOptional()
  bio?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Avatar image ID',
    example: 'avatar_12345'
  })
  @IsString()
  @IsOptional()
  avatarId?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Banner image ID',
    example: 'banner_12345'
  })
  @IsString()
  @IsOptional()
  bannerId?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Twitter link',
    example: 'https://twitter.com/user'
  })
  @IsString()
  @IsOptional()
  twitter?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Discord link',
    example: 'https://discord.gg/user'
  })
  @IsString()
  @IsOptional()
  discord?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Facebook link',
    example: 'https://facebook.com/user'
  })
  @IsString()
  @IsOptional()
  facebook?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Reddit link',
    example: 'https://reddit.com/user'
  })
  @IsString()
  @IsOptional()
  reddit?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'User email',
    example: 'user@example.com'
  })
  @IsString()
  @IsOptional()
  email?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Offer threshold token',
    example: 'TOKEN_ID'
  })
  @IsString()
  @IsOptional()
  offerToken?: OfferToken

  @ApiProperty({
    required: false,
    description: 'Offer threshold value',
    example: 100
  })
  @IsString()
  @IsOptional()
  minOfferThreshold?: bigint
}
