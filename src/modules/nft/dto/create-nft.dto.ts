// create-nft.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { Network, NftType } from '@prisma/client'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateNftDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Collection ID of the NFT'
  })
  @IsString()
  @IsNotEmpty()
  collectionId: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Type of the NFT'
  })
  @IsString()
  @IsNotEmpty()
  nftType: NftType

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Mint price of the NFT'
  })
  @IsString()
  @IsNotEmpty()
  price: bigint

  @ApiProperty({
    required: true,
    type: 'number',
    description: 'Royalty percentage for the NFT'
  })
  @IsNumber()
  @IsNotEmpty()
  royalty: number

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Network where the NFT is minted'
  })
  @IsString()
  @IsNotEmpty()
  network: Network

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Transaction Hash for the minting process'
  })
  @IsString()
  @IsNotEmpty()
  txHash: string
}
