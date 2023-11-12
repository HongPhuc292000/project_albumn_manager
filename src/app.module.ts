import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumnModule } from './albumn/albumn.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import databaseConfig from './configs/database.config';
import jwtRegisterConfig from './configs/jwtRegister.config';
import { PhotoModule } from './photo/photo.module';
import JwtConfigService from './services/jwtConfig.service';
import { TypeOrmConfigService } from './services/typeormConfig.service';
import { UserModule } from './user/user.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env.dev' : `.env.${ENV}`,
      isGlobal: true,
      load: [databaseConfig, jwtRegisterConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    AuthModule,
    UserModule,
    PhotoModule,
    AlbumnModule,
    CommentModule,
  ],
})
export class AppModule {}

// {
//   imports: [ConfigModule],
//   inject: [ConfigService],
//   useFactory: (configService: ConfigService) => ({
//     global: true,
//     secret: configService.get('SECRET_JWT'),
//     signOptions: { expiresIn: '2h' },
//   }),
// }
