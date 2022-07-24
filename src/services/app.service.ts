import { Injectable, NotFoundException } from '@nestjs/common';
import { Signal } from '../models/signal.entity';
import { BinanceService } from './binance.service';
import { RSIService } from './rsi.service';

@Injectable()
export class AppService {
  constructor(
    private readonly binanceService: BinanceService,
    private readonly rsiService: RSIService,
  ) {}
  async checkSignal(pair: string) {
    const tickers = await this.binanceService.getTickers(pair);
    const closePrices = tickers.map((t) => t[4]);
    const rsi = this.rsiService.CalculateRSI(14, closePrices);

    const rsi1 = rsi[rsi.length - 1];
    const rsi2 = rsi[rsi.length - 2];

    if (rsi2 < 40 && rsi1 > 40) {
      return new Signal({
        pairSymbol: pair,
        signalDate: new Date().toDateString(),
        rsi1,
        rsi2,
        prevClose: closePrices[closePrices.length - 2],
      });
    } else {
      throw new NotFoundException('No signal for symbol');
    }
  }
}
