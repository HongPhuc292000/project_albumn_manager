import { Controller, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ResponseData } from 'src/types';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ResponseData<string>> {
    return await this.authService.handleLogin(loginDto);
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ResponseData<string>> {
    return await this.authService.handleRegister(registerDto);
  }

  @Post('verify-email/:id')
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseData<string>> {
    return await this.authService.handleVerifyEmail(id, verifyEmailDto);
  }
}
