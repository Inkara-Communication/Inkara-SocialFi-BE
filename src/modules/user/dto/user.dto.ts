export interface VerifyGoogleInput {
  google_token_id: string
}

export interface ListAddressIndexInput {
  google_token_id: string
  listIndex: number[]
}

export interface privateKeyIndexInput {
  google_token_id: string
  index: number
}
