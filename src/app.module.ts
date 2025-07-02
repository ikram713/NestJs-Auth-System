import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config from './auth/config/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Configuration setup (first import)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'development'}`],
      load: [config],
      cache: true,
    }),

    // Database setup
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.connectionString'),
        dbName: configService.get<string>('database.name'),
      }),
    }),

    // AuthModule (contains its own JWT configuration)
    AuthModule,
  ],
})
export class AppModule {}