import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Signal } from '../models/signal.entity';
import { AppService } from '../services/app.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(Signal)
    private signalRepo: Repository<Signal>,
  ) {}

  @ApiOkResponse({ status: HttpStatus.OK, type: Signal })
  @ApiParam({ name: 'symbol', type: String, example: 'BTCTRY' })
  @Get('check_signals/:symbol')
  async checkSignal(@Param('symbol') paritySymbol: string) {
    return this.appService.checkSignal(paritySymbol);
  }

  @ApiOkResponse({ status: HttpStatus.OK, type: Signal })
  @ApiParam({ name: 'symbol', type: String, example: 'BTCTRY' })
  @Put('save_signals/:symbol')
  async saveSignal(@Param('symbol') paritySymbol: string) {
    const signal = await this.appService.checkSignal(paritySymbol);
    await this.signalRepo.save(signal);
    return signal;
  }

  @ApiOkResponse({ status: HttpStatus.OK, type: Signal, isArray: true })
  @ApiParam({ name: 'symbol', type: String, example: 'BTCTRY' })
  @Get('history/:symbol')
  getHistoryByPair(@Param('symbol') symbol: string) {
    return this.signalRepo.find({ where: { pairSymbol: symbol } });
  }

  @ApiOkResponse({ status: HttpStatus.OK, type: Signal, isArray: true })
  @Get('history')
  async getHistory() {
    return this.signalRepo.find();
  }
}
