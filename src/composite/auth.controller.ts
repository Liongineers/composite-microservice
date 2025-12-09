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
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'JWT token returned' })
  async googleAuthCallback(@Req() req: any, @Res() res: any): Promise<void> {
    const url = `http://34.55.28.157:8080/auth/google/callback?${req.url.split('?')[1]}`;

    const result = await axios.get(url);

    // result contains your JWT from Users service
    // Send to frontend
    res.json(result.data);
  }
}
