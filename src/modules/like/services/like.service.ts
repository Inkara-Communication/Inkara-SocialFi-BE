import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import { GeneratorService } from '@common/providers'
import { FilterParams, UserFilterByOption } from '@common/dto/filter-params.dto'
import { PaginationParams } from '@common/dto/pagenation-params.dto'
import { LikeType } from '@prisma/client'

@Injectable()
export class LikeService {
  private logger = new Logger(LikeService.name)

  constructor(
    private readonly prismaService: PrismaService,
    private generatorService: GeneratorService
  ) {}

  // Likes for NFT
  async getListNftLikeByUser(
    userId: string,
    { filterBy }: FilterParams,
    { offset = 1, limit = 20, startId = 0 }: PaginationParams
  ) {
    switch (filterBy) {
      case UserFilterByOption.FAVORITE:
        return await this.prismaService.like.findMany({
          where: {
            userId,
            type: LikeType.nft
          },
          skip: offset * startId,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            nft: {
              include: {
                owner: true
              }
            }
          }
        })
    }
  }

  async getNftLikeByUser(userId: string, nftId: string) {
    return await this.prismaService.like.findFirst({
      where: {
        userId,
        nftId,
        type: LikeType.nft
      },
      include: {
        nft: {
          include: {
            owner: true
          }
        }
      }
    })
  }

  async createNftLike(userId: string, nftId: string) {
    return await this.prismaService.like.create({
      data: {
        id: this.generatorService.uuid(),
        user: {
          connect: {
            id: userId
          }
        },
        nft: {
          connect: {
            id: nftId
          }
        },
        type: LikeType.nft
      }
    })
  }

  async deleteNftLike(nftId: string, userId: string) {
    try {
      const like = await this.prismaService.like.findFirst({
        where: {
          nftId,
          userId,
          type: LikeType.nft
        }
      })
      if (!like)
        throw new HttpException(
          'Invalid nftId or userId',
          HttpStatus.EXPECTATION_FAILED
        )

      return await this.prismaService.like.delete({
        where: { id: like.id }
      })
    } catch (e) {
      this.logger.error(e)
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // Likes for Post
  async getPostLikesByUser(
    userId: string,
    { filterBy }: FilterParams,
    { offset = 1, limit = 20, startId = 0 }: PaginationParams
  ) {
    switch (filterBy) {
      case UserFilterByOption.FAVORITE:
        return await this.prismaService.like.findMany({
          where: {
            userId,
            type: LikeType.post
          },
          skip: offset * startId,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            post: {
              include: {
                user: true
              }
            }
          }
        })
    }
  }

  async getPostLikeByUser(userId: string, postId: string) {
    return await this.prismaService.like.findFirst({
      where: {
        userId,
        postId,
        type: LikeType.post
      },
      include: {
        post: {
          include: {
            user: true
          }
        }
      }
    })
  }

  async createPostLike(userId: string, postId: string) {
    return await this.prismaService.like.create({
      data: {
        id: this.generatorService.uuid(),
        user: {
          connect: {
            id: userId
          }
        },
        post: {
          connect: {
            id: postId
          }
        },
        type: LikeType.post
      }
    })
  }

  async deletePostLike(postId: string, userId: string) {
    try {
      const like = await this.prismaService.like.findFirst({
        where: {
          postId,
          userId,
          type: LikeType.post
        }
      })
      if (!like)
        throw new HttpException(
          'Invalid postId or userId',
          HttpStatus.EXPECTATION_FAILED
        )

      return await this.prismaService.like.delete({
        where: {
          id: like.id,
          type: LikeType.post
        }
      })
    } catch (e) {
      this.logger.error(e)
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
