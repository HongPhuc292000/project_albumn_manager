import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { AllTypeConfig } from 'src/configs';

@Injectable()
export default class JwtConfigService implements JwtOptionsFactory {
  constructor(private configService: ConfigService<AllTypeConfig>) {}
  createJwtOptions(): JwtModuleOptions {
    const jwtRegisterConfig: JwtModuleOptions = this.configService.get(
      'jwtRegister',
      {
        infer: true,
      },
    );

    return {
      global: jwtRegisterConfig.global,
      secret: jwtRegisterConfig.secret,
      signOptions: jwtRegisterConfig.signOptions,
    };
  }
}
