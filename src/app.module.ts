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
import databaseConfig from './configs/database.config';
import { TypeOrmConfigProvider } from './providers/typeormConfig.provider';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env.dev' : `.env.${ENV}`,
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigProvider,
    }),
    JwtModule.registerAsync(jwtRegisterConfig),
    AuthModule,
    UserModule,
    PhotoModule,
    AlbumnModule,
    CommentModule,
  ],
})
export class AppModule {}
