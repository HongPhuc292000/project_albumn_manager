import { JwtModuleOptions } from '@nestjs/jwt';
import { DatabaseConfig } from './database.config';

export * from './swagger.config';
export * from './jwtRegister.config';

export interface AllTypeConfig {
  database: DatabaseConfig;
  jwtRegister: JwtModuleOptions;
}
