// signin-google.dto.ts

import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsNumber,
  ArrayNotEmpty
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class VerifyGoogleInput {
  @ApiProperty({
    required: true,
    description: 'Google token ID for verification.',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  google_token_id: string
}

export class ListAddressIndexInput {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Google token ID for listing address indices',
    example: 'your-google-token-id'
  })
  @IsString()
  @IsNotEmpty()
  google_token_id: string

  @ApiProperty({ description: 'List of address indices', type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  listIndex: number[]
}

export class PrivateKeyIndexInput {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Google token ID for retrieving private key',
    example: 'your-google-token-id'
  })
  @IsString()
  @IsNotEmpty()
  google_token_id: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Index for private key',
    example: 0
  })
  @IsNumber()
  index: number
}
