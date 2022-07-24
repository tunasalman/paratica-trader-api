import { Module, OnApplicationBootstrap, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '../controllers/app.controller';
import { Signal } from '../models/signal.entity';
import { AppService } from '../services/app.service';
import { BinanceService } from '../services/binance.service';
import { RSIService } from '../services/rsi.service';
import { SeedingService } from '../services/seeding.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('POSTGRES_HOST'),
          port: configService.get<number>('POSTGRES_PORT'),
          username: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DB'),
          synchronize: true,
          entities: [Signal],
        };
      },
    }),

    TypeOrmModule.forFeature([Signal]),
  ],

  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    BinanceService,
    RSIService,
    AppService,
    SeedingService,
  ],
  controllers: [AppController],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seedingService: SeedingService) {}

  async onApplicationBootstrap() {
    await this.seedingService.seed();
  }
}
