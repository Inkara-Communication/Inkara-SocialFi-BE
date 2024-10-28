// signin.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class SigninDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Wallet address',
    example: '0x1234567890abcdef1234567890abcdef12345678'
  })
  @IsString()
  @IsNotEmpty()
  walletAddress: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Sign signature',
    example:
      '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  })
  @IsString()
  @IsNotEmpty()
  signature: string
}
