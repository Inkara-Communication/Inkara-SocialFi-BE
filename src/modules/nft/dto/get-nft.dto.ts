// get-nft.dto.ts

import { FilterParams } from '@common/dto/filter-params.dto'
import { PaginationParams } from '@common/dto/pagenation-params.dto'
import { SearchParams } from '@common/dto/search-params.dto'
import { SortParams } from '@common/dto/sort-params.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class GetNftDto {
  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Contract address of the NFT'
  })
  @IsString()
  @IsNotEmpty()
  contractAddress: string

  @ApiProperty({
    required: true,
    type: 'string',
    description: 'Token ID of the NFT'
  })
  @IsString()
  @IsNotEmpty()
  tokenId: string
}

export class PaginationDto {
  @ApiProperty({
    required: true,
    type: 'object',
    description: 'Sort parameters for the query'
  })
  @IsNotEmpty()
  sort: SortParams

  @ApiProperty({
    required: true,
    type: 'object',
    description: 'Search parameters for the query'
  })
  @IsNotEmpty()
  search: SearchParams

  @ApiProperty({
    required: true,
    type: 'object',
    description: 'Pagination parameters for the query'
  })
  @IsNotEmpty()
  pagination: PaginationParams

  @ApiProperty({
    required: true,
    type: 'object',
    description: 'Filter parameters for the query'
  })
  @IsNotEmpty()
  filter: FilterParams
}
