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
