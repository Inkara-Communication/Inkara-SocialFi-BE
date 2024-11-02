// create-signature.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class signMessageDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Address of user'
  })
  @IsNotEmpty()
  userAddress: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Input action contract'
  })
  @IsNotEmpty()
  action: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Input nonce'
  })
  @IsNotEmpty()
  nonce: string
}
