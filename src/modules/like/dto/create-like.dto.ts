// create-like.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreateLikeDto {
  @ApiProperty({
    required: false,
    type: 'string',
    description: 'ID of the NFT being liked'
  })
  @IsString()
  @IsOptional()
  nftId?: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'ID of the post being liked'
  })
  @IsString()
  @IsOptional()
  postId?: string
}
