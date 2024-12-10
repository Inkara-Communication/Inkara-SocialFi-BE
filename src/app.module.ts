import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'

import { ActivityModule } from './modules'
import { AuthModule } from '@modules/auth'
import { CollectionModule } from '@modules/collection'
import { ListingModule } from '@modules/listing'
import { UserModule } from '@modules/user'
import { OfferModule } from '@modules/offer'
import { NotificationModule } from '@modules/notification'
import { NftModule } from '@modules/nft'
import { LikeModule } from '@modules/like'
import { HideModule } from '@modules/hide'
import { TransactionModule } from '@modules/transaction'

import { CommonModule } from './common'
import { configuration } from './config'
import { HealthModule } from './health'
import { PrismaModule } from './prisma'
import { RedisModule } from './redis'
import { InkRequestMiddleware, LoggerMiddleware } from '@common/middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    ScheduleModule.forRoot(),
    ActivityModule,
    AuthModule,
    CollectionModule,
    CommonModule,
    HealthModule,
    ListingModule,
    NftModule,
    NotificationModule,
    OfferModule,
    PrismaModule,
    RedisModule,
    UserModule,
    LikeModule,
    HideModule,
    TransactionModule
  ]
})
export class AppModule implements NestModule {
  // Global Middleware, Inbound logging
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware, InkRequestMiddleware).forRoutes('*')
  }
}
