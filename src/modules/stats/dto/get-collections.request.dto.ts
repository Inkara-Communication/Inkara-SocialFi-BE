// get-collections.request.dto.ts

import { IsOptional, IsString } from 'class-validator'

export class GetCollectionsRequest {
  @IsOptional()
  sortAscending?: boolean

  @IsOptional()
  @IsString()
  sortBy?: string
}
