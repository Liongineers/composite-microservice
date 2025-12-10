import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import axios from 'axios';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirect to Google OAuth' })
  async googleAuth(@Req() req: any, @Res() res: any): Promise<void> {
    const redirectUrl = `http://34.55.28.157:8080/auth/google`;
    return res.redirect(redirectUrl);
  }

  @Get('google/callback')
  async googleAuthCallback(@Req() req: any, @Res() res: any): Promise<void> {
  const queryString = req.url.split('?')[1];

  // Forward callback to users-microservice so the BROWSER continues the OAuth redirect chain
  const usersCallbackUrl = `http://34.55.28.157:8080/auth/google/callback?${queryString}`;

  return res.redirect(usersCallbackUrl);
  }

}
