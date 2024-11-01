// create-signature.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateSignatureDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Method data of contract'
  })
  @IsNotEmpty()
  methodData: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Input contract address'
  })
  @IsNotEmpty()
  contractAddress: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Input private key'
  })
  @IsNotEmpty()
  privateKey: string
}
