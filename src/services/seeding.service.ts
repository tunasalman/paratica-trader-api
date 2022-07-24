import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';
import { Signal } from '../models/signal.entity';

@Injectable()
export class SeedingService {
  constructor(private readonly entityManager: EntityManager) {}

  async seed() {
    const now = new Date().toDateString();
    const signalSeed = [
      {
        id: 1,
        pairSymbol: 'BTCTRY',
        signalDate: now,
        rsi1: 41,
        rsi2: 39,
        prevClose: 407438,
      },
      {
        id: 2,
        pairSymbol: 'ETHTRY',
        signalDate: now,
        rsi1: 41,
        rsi2: 39,
        prevClose: 20743,
      },
    ] as Signal[];

    const count = await this.entityManager.count(Signal);

    if (count == 0) {
      await this.entityManager.save(Signal, signalSeed);
    }
  }
}
