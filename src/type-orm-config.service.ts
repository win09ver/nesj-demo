import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const configService = new ConfigService(); // ポイント
    return {
      type: configService.get('DB_TYPE'),
      host: configService.get('DB_HOST', 'localhost'),
      port: Number(configService.get('DB_PORT', 5432)),
      username: configService.get('DB_USERNAME', 'postgres'),
      password: configService.get('DB_PASSWORD', 'postgres'),
      database: configService.get('DB_DATABASE', 'postgres'),
      entities: [join(__dirname + '../**/*.entity{.ts,.js}')],
      synchronize: false,
    } as TypeOrmModuleOptions;
  }
}
