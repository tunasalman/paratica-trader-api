import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'signals',
})
export class Signal {
  constructor(partial: Partial<Signal>) {
    Object.assign(this, partial);
  }

  @Exclude()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  pairSymbol: string;

  @ApiProperty()
  @Column({ type: 'timestamptz' })
  signalDate: string;

  @ApiProperty()
  @Column()
  rsi1: number;

  @ApiProperty()
  @Column()
  rsi2: number;

  @ApiProperty()
  @Column()
  prevClose: number;
}
