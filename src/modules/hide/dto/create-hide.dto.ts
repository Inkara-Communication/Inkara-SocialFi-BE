// create-hide.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateHideDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Nft id',
    example: '1234'
  })
  @IsString()
  @IsNotEmpty()
  nftId: string
}
