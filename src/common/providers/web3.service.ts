import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { Network } from '@prisma/client'
// import { firstValueFrom } from 'rxjs'
import Web3, { Contract } from 'web3'
import { Web3Account } from 'web3-eth-accounts'
import axios from 'axios'
import {
  MINTNFT_EVENT_ABI,
  INKARA_TOKEN_CONTRACT_ABI,
  INKARA_NFT_CONTRACT_ABI,
  INKARA_REWARD_CONTRACT_ABI
} from '@config/abi'
import {
  INKARA_TOKEN_CONTRACT_ADDRESS,
  INKARA_NFT_CONTRACT_ADDRESS,
  INKARA_REWARD_CONTRACT_ADDRESS
} from '@config/address'
import {
  // BuyOrderParameters,
  // OrderParameters,
  TokenData
} from '@common/types'
import * as bip39 from 'bip39'
import { hdkey } from 'ethereumjs-wallet'
import assert from 'assert'
import CryptoJS from 'crypto-js'
// import { ListingDto } from '@modules/listing/dto/listing.dto'
// import { AcceptOfferDto } from '@modules/offer/dto/accept-offer.dto'

@Injectable()
export class Web3Service {
  private logger = new Logger(Web3Service.name)
  private readonly web3: Record<Network, Web3>
  private account: Record<Network, Web3Account>
  private inkaraTokenContract: Record<
    Network,
    Contract<typeof INKARA_TOKEN_CONTRACT_ABI>
  >
  private inkaraNftContract: Record<
    Network,
    Contract<typeof INKARA_NFT_CONTRACT_ABI>
  >
  private inkaraRewardContract: Record<
    Network,
    Contract<typeof INKARA_REWARD_CONTRACT_ABI>
  >
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.web3 = {
      EMERALD: new Web3(
        new Web3.providers.HttpProvider(
          this.configService.get('blockchain.EMERALD')
        )
      )
    }

    this.account = {
      EMERALD: this.web3.EMERALD.eth.accounts.privateKeyToAccount(
        `0x${this.configService.get('credential.ACCOUNT_PRIVATE_KEY')}`
      )
    }

    this.inkaraTokenContract = {
      EMERALD: new this.web3.EMERALD.eth.Contract(
        INKARA_TOKEN_CONTRACT_ABI,
        INKARA_TOKEN_CONTRACT_ADDRESS
      )
    }

    this.inkaraNftContract = {
      EMERALD: new this.web3.EMERALD.eth.Contract(
        INKARA_NFT_CONTRACT_ABI,
        INKARA_NFT_CONTRACT_ADDRESS
      )
    }

    this.inkaraRewardContract = {
      EMERALD: new this.web3.EMERALD.eth.Contract(
        INKARA_REWARD_CONTRACT_ABI,
        INKARA_REWARD_CONTRACT_ADDRESS
      )
    }
  }

  async getBalance(network: Network, address: string): Promise<bigint> {
    return this.web3[network].eth.getBalance(address)
  }

  async getTransaction(network: Network, transactionHash: string) {
    return await this.web3[network].eth.getTransaction(transactionHash)
  }

  async getTransactionReceipt(network: Network, transactionHash: string) {
    return await this.web3[network].eth.getTransactionReceipt(transactionHash)
  }

  async getBlockNumber(network: Network) {
    return await this.web3[network].eth.getBlockNumber()
  }

  public getInkaraNftContract(
    network: Network
  ): Contract<typeof INKARA_NFT_CONTRACT_ABI> {
    return this.inkaraNftContract[network]
  }

  public async getPrivateIndex(mnemonic: string, index: number) {
    const decryptedBytes = CryptoJS.AES.decrypt(mnemonic, '')
    const decryptedMnemonic = decryptedBytes.toString(CryptoJS.enc.Utf8)
    assert(bip39.validateMnemonic(decryptedMnemonic), 'Invalid mnemonic')

    const wallet_hdpath = "m/44'/60'/0'/0/"
    const seed = await bip39.mnemonicToSeed(mnemonic)
    const hdwallet = hdkey.fromMasterSeed(seed)
    const wallet = this.web3.EMERALD.eth.accounts.wallet.create(0)
    const baseWallet = hdwallet.derivePath(wallet_hdpath + index).getWallet()
    const privateKey = baseWallet.getPrivateKey().toString('hex')
    wallet.clear()
    wallet.add(privateKey)
    return privateKey
  }

  async mintNft({ network, txHash }: { network: Network; txHash: string }) {
    let tokenDatas: TokenData[] = {} as TokenData[]
    const rept = await this.getTransactionReceipt(network, txHash)
    try {
      const tokenAddress = rept.to
      const eventId =
        this.web3[network].eth.abi.encodeEventSignature(MINTNFT_EVENT_ABI)
      const logs = rept.logs.filter(log => log.topics[0] === eventId)
      const tokenIds = logs.map(log =>
        this.web3[network].eth.abi
          .decodeLog(
            MINTNFT_EVENT_ABI.inputs,
            log.data.toString(),
            log.topics.map(t => t.toString())
          )
          .tokenId.toString()
      )
      tokenDatas = await Promise.all(
        tokenIds.map(async tokenId => {
          const contract = new this.web3.EMERALD.eth.Contract(
            INKARA_NFT_CONTRACT_ABI,
            tokenAddress
          )
          const tokenUri = (await contract.methods
            .tokenURI(tokenId)
            .call()) as string
          this.logger.log(`tokenUri is ${tokenUri}`)
          let metadata = {
            name: '',
            description: '',
            image: '',
            attributes: ''
          }
          try {
            const res = await axios.get(tokenUri)
            let image = (await res.data?.image) || ''
            image = image.replace('ipfs://', 'https://ipfs.io/ipfs/')
            image = image.replace('nftstorage.link', 'ipfs.io')
            metadata = {
              name: res.data?.name || '',
              description: res.data?.description || '',
              image,
              attributes: res.data?.attributes || ''
            }
          } catch (e) {
            this.logger.error(e)
          }
          return {
            tokenAddress,
            tokenId,
            tokenUri,
            metadata
          }
        })
      )
      return { tokenDatas, error: '' }
    } catch (e) {
      this.logger.error(e)
      return { tokenDatas, error: e }
    }
  }

  // async cancelListing({ network, txHash }: ListingDto) {
  //   let orderParameters: OrderParameters = {} as OrderParameters
  //   const transaction = await this.getTransaction(network, txHash)
  //   const methodId =
  //     this.web3[network].eth.abi.encodeFunctionSignature(CANCEL_FUNCTION_ABI)
  //   console.log('methodId', methodId)
  //   if (!transaction.input || transaction.input.search(methodId) === -1) return
  //   try {
  //     const params = this.web3[network].eth.abi.decodeParameters(
  //       CANCEL_FUNCTION_ABI.inputs,
  //       transaction.data.split(methodId)[1]
  //     )
  //     orderParameters = params['orders']['0']
  //     return { orderParameters, error: '' }
  //   } catch (e) {
  //     this.logger.error(e)
  //     return { orderParameters, error: e }
  //   }
  // }

  // async buyListing({ network, txHash }: ListingDto) {
  //   const orderParameters: BuyOrderParameters = {} as BuyOrderParameters
  //   const rept = await this.getTransactionReceipt(network, txHash)
  //   try {
  //     const orderParameters = this.web3[network].eth.abi.decodeLog(
  //       ORDERFULFILLED_EVENT_ABI.inputs,
  //       rept.logs[0].data.toString(),
  //       rept.logs[0].topics.map(t => t.toString())
  //     )
  //     return { orderParameters, error: '' }
  //   } catch (e) {
  //     this.logger.error(e)
  //     return { orderParameters, error: e }
  //   }
  // }

  // async acceptOffer({ network, txHash }: AcceptOfferDto) {
  //   const orderParameters: BuyOrderParameters = {} as BuyOrderParameters
  //   const rept = await this.getTransactionReceipt(network, txHash)
  //   try {
  //     const orderParameters = this.web3[network].eth.abi.decodeLog(
  //       ORDERFULFILLED_EVENT_ABI.inputs,
  //       rept.logs[0].data.toString(),
  //       rept.logs[0].topics.map(t => t.toString())
  //     )
  //     return { orderParameters, error: '' }
  //   } catch (e) {
  //     this.logger.error(e)
  //     return { orderParameters, error: e }
  //   }
  // }
}
