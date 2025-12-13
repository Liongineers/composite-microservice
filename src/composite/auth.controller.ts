import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import axios from 'axios';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly usersServiceUrl: string;

  constructor() {
    // Use environment variable with fallback
    this.usersServiceUrl = process.env.USERS_SERVICE_URL || 'http://34.57.57.27:8080';
  }

  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirect to Google OAuth' })
  async googleAuth(@Req() req: any, @Res() res: any): Promise<void> {
    const redirectUrl = `${this.usersServiceUrl}/auth/google`;
    return res.redirect(redirectUrl);
  }

  @Get('google/callback')
  async googleAuthCallback(@Req() req: any, @Res() res: any): Promise<void> {
  const queryString = req.url.split('?')[1];

  // Forward callback to users-microservice so the BROWSER continues the OAuth redirect chain
  const usersCallbackUrl = `${this.usersServiceUrl}/auth/google/callback?${queryString}`;

  return res.redirect(usersCallbackUrl);
  }

}
