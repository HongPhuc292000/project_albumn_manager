import {
  Controller,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ResponseData } from 'src/types';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import {
  ForgotPasswordDto,
  SetNewPasswordDto,
} from './dto/forgot-password.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
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

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.handleForgotPassword(forgotPasswordDto);
  }

  @Patch('forgot-password/:token')
  setNewPassword(
    @Body() setNewPasswordDto: SetNewPasswordDto,
    @Param('token') token: string,
  ) {
    return this.authService.handleSetNewPassword(setNewPasswordDto, token);
  }
}
