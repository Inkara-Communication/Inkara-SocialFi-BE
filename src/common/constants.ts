import { Network } from '@prisma/client'

export const networks: Record<
  Network,
  {
    chainId: number
    url: string
  }
> = {
  EMERALD: {
    chainId: 42261,
    url: 'https://testnet.emerald.oasis.io'
  }
}

export const CONTRACT_NAME = {
  INKARA_NFT: 'InkaraNFT',
  INKARA_BADGE: 'InkaraBadge',
  INKARA_MARKETPLACE: 'InkaraMarketplace',
  INKARA_AUCTION: 'InkaraAuction',
  INKARA_EVENT: 'InkaraEvent',
  INKARA_DAO: 'InkaraDAO',
  INKARA_GAME: 'InkaraGame'
}

export const NETWORK_STATUS_MESSAGE = {
  EMPTY: 'Empty',
  INVALID: 'Invalid response',
  SUCCESS: 'Success',
  BAD_REQUEST: 'Bad request',
  EXPIRE: 'Expire time',
  UNAUTHORIZED: 'Unauthorized',
  NOT_FOUND: 'Not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  NOT_ENOUGH_RIGHT: 'Not Enough Rights',
  VALIDATE_ERROR: 'Validate error'
}
