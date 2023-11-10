import { ConfigModule, ConfigService } from '@nestjs/config';

const jwtRegisterConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    global: true,
    secret: configService.get('SECRET_JWT'),
    signOptions: { expiresIn: '2h' },
  }),
};

export { jwtRegisterConfig };
