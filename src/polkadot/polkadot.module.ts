import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PolkadotService } from './polkadot.service';

@Module({
  imports: [ConfigModule],
  providers: [PolkadotService],
  exports: [PolkadotService],
  controllers: [],
})
export class PolkadotModule {}
