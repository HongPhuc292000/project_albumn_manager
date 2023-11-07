import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ResponseData } from 'src/types';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VERIFY_CODE } from 'src/utils/constant';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async handleLogin(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.usersRepository.findOne({
      where: [{ username }, { email: username }],
    });

    if (!user) {
      throw new HttpException(
        'email or username is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.password !== password) {
      throw new HttpException('password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
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
      throw new HttpException('email is used', HttpStatus.BAD_REQUEST);
    }

    if (usedUserName) {
      throw new HttpException('username is used', HttpStatus.BAD_REQUEST);
    }

    const newUser = this.usersRepository.create(registerDto);
    await this.usersRepository.save(newUser);
    return new ResponseData<string>(
      'ok',
      HttpStatus.CREATED,
      'register success',
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
      throw new HttpException('not found user', HttpStatus.NOT_FOUND);
    }

    if (emailUsed && user.id !== emailUsed.id) {
      throw new HttpException('email used', HttpStatus.CONFLICT);
    }

    if (code !== VERIFY_CODE) {
      throw new HttpException('code is invalid', HttpStatus.NOT_ACCEPTABLE);
    }

    if (user.email !== email) {
      user.email = email;
    }
    user.isVerified = 1;
    await this.usersRepository.save(user);
    return new ResponseData<string>('ok', HttpStatus.OK, 'verify success');
  }
}
