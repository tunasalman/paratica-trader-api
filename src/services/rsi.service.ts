import { Injectable } from '@nestjs/common';

@Injectable()
export class RSIService {
  private calculateDifference(currentPrice: number, prevPrice: number) {
    return currentPrice - prevPrice;
  }

  private calculatePositiveChange(difference: number) {
    return difference > 0 ? difference : 0;
  }

  private calculateNegativeChange(difference: number) {
    return difference < 0 ? difference * -1 : 0;
  }

  public CalculateRSI(period: number, closePrices: number[]) {
    if (period < 1) {
      throw new Error('Period has to be a positive integer.');
    }

    const positiveChanges: number[] = [];
    const negativeChanges: number[] = [];
    const averageGain: number[] = [];
    const averageLoss: number[] = [];
    const rsi: number[] = [];
    for (let i = 0; i < closePrices.length; i++) {
      const prevClose = closePrices[i - 1];
      const currentClose = closePrices[i];
      const currentDiff = this.calculateDifference(currentClose, prevClose);

      if (i > 0) {
        positiveChanges[i] = this.calculatePositiveChange(currentDiff);

        negativeChanges[i] = this.calculateNegativeChange(currentDiff);
      }

      if (i == period) {
        let gainSum = 0;
        let lossSum = 0;
        for (let x = period; x > 0; x--) {
          gainSum += positiveChanges[x];
          lossSum += negativeChanges[x];
        }
        averageGain[i] = gainSum / period;
        averageLoss[i] = lossSum / period;
      } else if (i > period) {
        averageGain[i] =
          (averageGain[i - 1] * (period - 1) + positiveChanges[i]) / period;

        averageLoss[i] =
          (averageLoss[i - 1] * (period - 1) + negativeChanges[i]) / period;

        rsi[i] =
          averageLoss[i] == 0
            ? 100
            : averageGain[i] == 0
            ? 0
            : Math.round(100 - 100 / (1 + averageGain[i] / averageLoss[i]));
      }
    }
    return rsi;
  }
}
