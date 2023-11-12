import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Albumn } from 'src/albumn/entities/albumn.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { AllTypeConfig } from 'src/configs';
import { Photo } from 'src/photo/entities/photo.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<AllTypeConfig>) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseConfig = this.configService.getOrThrow('database', {
      infer: true,
    });

    return {
      type: databaseConfig.type,
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.name,
      entities: [__dirname + '/../**/entities/*.entity.{ts,js}'],
      synchronize: databaseConfig.synchronize,
    } as TypeOrmModuleOptions;
  }
}
