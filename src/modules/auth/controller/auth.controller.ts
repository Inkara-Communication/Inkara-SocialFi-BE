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
import { SigninDto } from '@modules/auth/dto/signin.dto'
import {
  VerifyGoogleInput,
  ListAddressIndexInput
} from '@modules/auth/dto/signin-google.dto'
import { User } from '@prisma/client'
import { ForbiddenException } from '../../../errors'
import { AuthService } from '../services'

const moduleName = 'auth'

@ApiTags(moduleName)
@Controller(moduleName)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in' })
  @ApiBody({ type: SigninDto })
  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() data: SigninDto): Promise<any> {
    return await this.authService.signIn(data)
  }

  @ApiOperation({ summary: 'Google Sign-In Verification' })
  @ApiBody({ type: VerifyGoogleInput })
  @Public()
  @Post('verify-google')
  @HttpCode(HttpStatus.OK)
  async verifyGoogle(@Body() data: VerifyGoogleInput): Promise<User> {
    return await this.authService.VerifyGoogle(data)
  }

  @ApiOperation({ summary: 'Generate Wallet Address from Mnemonic' })
  @Post('generate-mnemonic')
  // @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async generateMnemonic(): Promise<string> {
    return this.authService.createWallet()
  }

  @ApiOperation({ summary: 'Generate Wallet Address from Mnemonic' })
  @ApiBody({ type: ListAddressIndexInput })
  @UseGuards(AccessTokenGuard)
  @Post('generate-address')
  @HttpCode(HttpStatus.OK)
  async generateAddress(
    @Body() data: ListAddressIndexInput
  ): Promise<string[]> {
    return await this.authService.getAddressIndexWallet(data)
  }

  @ApiOperation({ summary: 'Sign out' })
  @Post('signout')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async signout(
    @Request() req: IRequestWithUser
  ): Promise<{ message: string }> {
    await this.authService.signout(req.user.id)

    return { message: 'success' }
  }

  @ApiOperation({ summary: 'Refresh token' })
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Request() req: IRequestWithUser): Promise<any> {
    const { user } = req
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim()
    const payload: IPayloadUserJwt = {
      id: user.id,
      walletAddress: user.walletAddress
    }
    const authToken = await this.authService.refreshTokens(
      payload,
      refreshToken
    )

    return authToken
  }

  @ApiOperation({ summary: 'Validate token', description: 'forbidden' })
  @Post('validate')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async validateToken(@CurrentUser() user: User): Promise<User> {
    if (!user) throw new ForbiddenException('Unauthorized')
    await this.authService.validateAccessToken(user.id)
    return user
  }
}
