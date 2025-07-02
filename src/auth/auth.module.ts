import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSchema } from './schemas/user.schema';
import { RefreshTokenSchema } from './schemas/refresh-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      {name: 'RefreshToken', schema: RefreshTokenSchema}, 
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Make sure ConfigModule is imported
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'), // Access config
        signOptions: { 
          expiresIn: configService.get<string>('jwt.expiresIn'), 
        },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}