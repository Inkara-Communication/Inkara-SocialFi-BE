// update-profile.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { OfferToken } from '@prisma/client'
import { IsOptional, IsString, IsBoolean } from 'class-validator'

export class AvatarDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'URL of the avatar image'
  })
  @IsString()
  url!: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Mint ID of the avatar'
  })
  @IsString()
  mintId!: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Link to the avatar'
  })
  @IsString()
  link!: string

  @ApiProperty({
    required: true,
    type: 'boolean',
    description: 'Whether the avatar is verified'
  })
  @IsBoolean()
  verified!: boolean
}

export class UpdateProfileDto {
  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Bio of the user'
  })
  @IsString()
  @IsOptional()
  bio?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Avatar image ID'
  })
  @IsString()
  @IsOptional()
  avatarId?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Banner image ID'
  })
  @IsString()
  @IsOptional()
  bannerId?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Twitter link'
  })
  @IsString()
  @IsOptional()
  twitter?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Discord link'
  })
  @IsString()
  @IsOptional()
  discord?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Facebook link'
  })
  @IsString()
  @IsOptional()
  facebook?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Reddit link'
  })
  @IsString()
  @IsOptional()
  reddit?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'User email'
  })
  @IsString()
  @IsOptional()
  email?: string

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Offer threshold token'
  })
  @IsString()
  @IsOptional()
  offerToken?: OfferToken

  @ApiProperty({
    required: false,
    description: 'Offer threshold value'
  })
  @IsString()
  @IsOptional()
  minOfferThreshold?: bigint
}
