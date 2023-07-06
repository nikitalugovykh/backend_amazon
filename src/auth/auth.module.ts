import { LoggerService, Module } from "@nestjs/common"
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from "../prisma.service"
import { JwtModule } from "@nestjs/jwt"
import { getJwtConfig } from "../config/jwt.config"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtStrategy } from "./jwt.strategy"

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: getJwtConfig,
      inject: [ConfigService],
      imports: [ConfigModule]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
})
export class AuthModule {}
