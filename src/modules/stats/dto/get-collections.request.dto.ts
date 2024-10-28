// get-collections.request.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class GetCollectionsRequest {
  @ApiProperty({
    required: false,
    type: 'boolean',
    description: 'Sort in ascending order'
  })
  @IsOptional()
  @IsBoolean()
  sortAscending?: boolean

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Property to sort by'
  })
  @IsOptional()
  @IsString()
  sortBy?: string
}
