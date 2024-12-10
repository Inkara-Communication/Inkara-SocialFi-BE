//auth.controller.ts

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser, Public } from '@common/decorators'
import { AccessTokenGuard, RefreshTokenGuard } from '@common/guards'
import { IPayloadUserJwt, IRequestWithUser } from '@common/interfaces'
import { onError, onSuccess, type Option } from '@common/response'
import { AuthService } from '@modules/auth/services'
import { SignupDto, SigninDto } from '@modules/auth/dto'
import { User } from '@prisma/client'
import { ForbiddenException } from '../../../errors'

const moduleName = 'auth'

@ApiTags(moduleName)
@Controller(moduleName)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up' })
  @ApiBody({ type: SignupDto })
  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() signupDto: SignupDto) {
    return this.authService.signUp(signupDto)
  }

  @ApiOperation({ summary: 'Sign in' })
  @ApiBody({ type: SigninDto })
  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() data: SigninDto): Promise<Option<any>> {
    try {
      const res = await this.authService.signIn(data)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Sign out' })
  @Post('signout')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async signout(@Request() req: IRequestWithUser): Promise<Option<any>> {
    try {
      const res = await this.authService.signout(req.user.id)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Refresh token' })
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Request() req: IRequestWithUser): Promise<Option<any>> {
    try {
      const { user } = req
      const refreshToken = req.get('Authorization').replace('Bearer', '').trim()
      const payload: IPayloadUserJwt = {
        id: user.id,
        address: user.address
      }
      const res = await this.authService.refreshTokens(payload, refreshToken)
      return onSuccess(res)
    } catch (error) {
      return onError(error)
    }
  }

  @ApiOperation({ summary: 'Validate token', description: 'forbidden' })
  @Post('validate')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async validateToken(@CurrentUser() user: User): Promise<Option<User>> {
    try {
      if (!user) throw new ForbiddenException('Unauthorized')
      await this.authService.validateAccessToken(user.id)
      return onSuccess(user)
    } catch (error) {
      return onError(error)
    }
  }
}
