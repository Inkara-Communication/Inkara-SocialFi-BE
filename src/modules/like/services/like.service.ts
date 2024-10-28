import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import { GeneratorService } from '@common/providers'
import { FilterParams, UserFilterByOption } from '@common/dto/filter-params.dto'
import { PaginationParams } from '@common/dto/pagenation-params.dto'

@Injectable()
export class LikeService {
  private logger = new Logger(LikeService.name)

  constructor(
    private readonly prismaService: PrismaService,
    private generatorService: GeneratorService
  ) {}

  // Likes for NFT
  async getNftLikesByUser(
    userId: string,
    { filterBy }: FilterParams,
    { offset = 1, limit = 20, startId = 0 }: PaginationParams
  ) {
    switch (filterBy) {
      case UserFilterByOption.FAVORITE:
        return await this.prismaService.nftLike.findMany({
          where: {
            userId
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
    return await this.prismaService.nftLike.findFirst({
      where: {
        userId,
        nftId
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
    return await this.prismaService.nftLike.create({
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
        }
      }
    })
  }

  async deleteNftLike(nftId: string, userId: string) {
    try {
      const like = await this.prismaService.nftLike.findFirst({
        where: { nftId, userId }
      })
      if (!like)
        throw new HttpException(
          'Invalid nftId or userId',
          HttpStatus.EXPECTATION_FAILED
        )

      return await this.prismaService.nftLike.delete({
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
        return await this.prismaService.postLike.findMany({
          where: {
            userId
          },
          skip: offset * startId,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            post: {
              include: {
                user: true // Thay thế `author` bằng `user` (hoặc trường phù hợp với mô hình Post)
              }
            }
          }
        })
    }
  }

  async getPostLikeByUser(userId: string, postId: string) {
    return await this.prismaService.postLike.findFirst({
      where: {
        userId,
        postId
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
    return await this.prismaService.postLike.create({
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
        }
      }
    })
  }

  async deletePostLike(postId: string, userId: string) {
    try {
      const like = await this.prismaService.postLike.findFirst({
        where: { postId, userId }
      })
      if (!like)
        throw new HttpException(
          'Invalid postId or userId',
          HttpStatus.EXPECTATION_FAILED
        )

      return await this.prismaService.postLike.delete({
        where: { id: like.id }
      })
    } catch (e) {
      this.logger.error(e)
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
