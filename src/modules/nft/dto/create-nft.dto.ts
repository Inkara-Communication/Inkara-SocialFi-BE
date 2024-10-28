// create-nft.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { Network, NftType } from '@prisma/client'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateNftDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Collection ID of the NFT',
    example: 'collection_12345'
  })
  @IsString()
  @IsNotEmpty()
  collectionId: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Type of the NFT',
    example: 'ART'
  })
  @IsString()
  @IsNotEmpty()
  nftType: NftType

  @ApiProperty({
    required: true,
    description: 'Mint price of the NFT',
    example: '1000000000000000000'
  })
  @IsString()
  @IsNotEmpty()
  price: bigint

  @ApiProperty({
    required: true,
    description: 'Royalty percentage for the NFT',
    example: 5
  })
  @IsNumber()
  @IsNotEmpty()
  royalty: number

  @ApiProperty({
    required: true,
    description: 'Network where the NFT is minted',
    example: 'EMERALD'
  })
  @IsString()
  @IsNotEmpty()
  network: Network

  @ApiProperty({
    required: true,
    description: 'Transaction Hash for the minting process',
    example: '0xabc123456def789...'
  })
  @IsString()
  @IsNotEmpty()
  txHash: string
}
