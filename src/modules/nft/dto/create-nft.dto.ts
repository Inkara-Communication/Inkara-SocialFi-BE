// create-nft.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { Network, NftType } from '@prisma/client'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateNftDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Collection id of nft'
  })
  @IsString()
  @IsNotEmpty()
  collectionId: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Nft type'
  })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nftType: NftType

  @ApiProperty({
    required: true,
    description: 'Mint price'
  })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  price: bigint

  @ApiProperty({
    required: true,
    description: 'Royalty'
  })
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  royalty: number

  @ApiProperty({
    required: true,
    description: 'Network'
  })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  network: Network

  @ApiProperty({
    required: true,
    description: 'Transaction Hash'
  })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  txHash: string
}
