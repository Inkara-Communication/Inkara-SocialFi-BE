// create-like.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreateLikeDto {
  @ApiProperty({
    required: false,
    type: 'string',
    description: 'ID of the NFT being liked',
    example: 'nft_12345'
  })
  @IsString()
  @IsOptional()
  nftId?: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'ID of the post being liked',
    example: 'post_67890'
  })
  @IsString()
  @IsOptional()
  postId?: string
}
