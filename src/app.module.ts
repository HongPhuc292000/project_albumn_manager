import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumnModule } from './albumn/albumn.module';
import { Albumn } from './albumn/entities/albumn.entity';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guard/auth.guard';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/entities/comment.entity';
import { jwtRegisterConfig } from './configs';
import { Photo } from './photo/entities/photo.entity';
import { PhotoModule } from './photo/photo.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env.dev' : `.env.${ENV}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [User, Albumn, Photo, Comment],
        synchronize: true,
        retryAttempts: 1,
      }),
    }),
    JwtModule.registerAsync(jwtRegisterConfig),
    UserModule,
    PhotoModule,
    AlbumnModule,
    CommentModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
