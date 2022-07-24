import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Binance from 'node-binance-api';

export interface BinanceConfig {
  apiKey: string;
  secretKey: string;
}

@Injectable()
export class BinanceService {
  private api: Binance;
  constructor(private configService: ConfigService) {
    this.api = new Binance().options({
      APIKEY: configService.get<string>('BINANCE_API_KEY'),
      APISECRET: configService.get<string>('BINANCE_SECRET_KEY'),
    });
  }

  getTickers(pair: string): Promise<Array<Array<number>>> {
    return this.api.candlesticks(pair, '4h');
  }
}
