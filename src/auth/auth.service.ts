import {
  HttpException,
  HttpStatus,
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AllTypeConfig } from 'src/configs';
import { JWTPayload, ResponseData } from 'src/types';
import { User } from 'src/user/entities/user.entity';
import { VERIFY_CODE } from 'src/utils/constant';
import { Repository } from 'typeorm';
import {
  ForgotPasswordDto,
  SetNewPasswordDto,
} from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService<AllTypeConfig>,
  ) {}

  async handleLogin(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.usersRepository.findOne({
      where: [{ username }, { email: username }],
    });

    if (!user) {
      throw new BadRequestException({
        message: 'email or username is incorrect',
        error: 'Bad Request',
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException({
        message: 'password is incorrect',
        error: 'Bad Request',
      });
    }

    const payload = { sub: user.id, username: user.username };

    const jwtRegisterConfig = this.configService.getOrThrow('jwtRegister', {
      infer: true,
    });

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: jwtRegisterConfig.secret,
        expiresIn: jwtRegisterConfig.signOptions.expiresIn,
      }),
    };
  }

  async handleRegister(
    registerDto: RegisterDto,
  ): Promise<ResponseData<string>> {
    const usedEmail = await this.usersRepository.findOneBy({
      email: registerDto.email,
    });

    const usedUserName = await this.usersRepository.findOneBy({
      username: registerDto.username,
    });

    if (usedEmail) {
      throw new BadRequestException({
        message: 'email is used',
        error: 'Bad Request',
      });
    }

    if (usedUserName) {
      throw new BadRequestException({
        message: 'username is used',
        error: 'Bad Request',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(registerDto.password, salt);

    const newUser = this.usersRepository.create({ ...registerDto, password });
    await this.usersRepository.save(newUser);
    return new ResponseData<string>(
      'ok',
      HttpStatus.CREATED,
      'Register Success',
    );
  }

  async handleVerifyEmail(
    id: string,
    registerDto: VerifyEmailDto,
  ): Promise<ResponseData<string>> {
    const { email, code } = registerDto;
    const user = await this.usersRepository.findOneBy({
      id,
    });

    const emailUsed = await this.usersRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new NotFoundException({
        message: 'not found this user',
        error: 'Not Found',
      });
    }

    if (emailUsed && user.id !== emailUsed.id) {
      throw new BadRequestException({
        message: 'email is verified',
        error: 'Bad Request',
      });
    }

    if (code !== VERIFY_CODE) {
      throw new BadRequestException({
        message: 'code is invalid',
        error: 'Bad Request',
      });
    }

    if (user.email !== email) {
      user.email = email;
    }
    user.isVerified = 1;
    await this.usersRepository.save(user);
    return new ResponseData<string>('ok', HttpStatus.OK, 'Verify Success');
  }

  async handleForgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersRepository.findOneBy({
      email: forgotPasswordDto.email,
    });

    if (!user) {
      throw new BadRequestException({
        message: 'email has not been used, create new account',
        error: 'Bad Request',
      });
    }
    const payload = { sub: user.id, username: user.username };
    return await this.jwtService.signAsync(payload);
  }

  async handleSetNewPassword(
    setNewPasswordDto: SetNewPasswordDto,
    token: string,
  ) {
    const payload: JWTPayload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.getOrThrow('jwtRegister', {
        infer: true,
      }).secret,
    });

    const user = await this.usersRepository.findOneBy({
      id: payload.sub,
    });

    if (!user) {
      throw new ForbiddenException({
        message: 'forbidden',
        error: 'Forbidden',
      });
    }

    user.password = setNewPasswordDto.password;
    await this.usersRepository.save(user);

    return new ResponseData('ok', HttpStatus.OK, 'Password Changed');
  }
}
