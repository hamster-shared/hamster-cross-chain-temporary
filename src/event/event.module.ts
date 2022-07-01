import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Eth_eventService } from './eth_event.service';
import {Hamster_eventService} from "./hamster_event.service";
import {PolkadotModule} from "../polkadot/polkadot.module";
import {Web3Module} from "../web3/web3.module";

@Module({
  imports: [ConfigModule,PolkadotModule,Web3Module],
  providers: [Eth_eventService,Hamster_eventService],
  exports: [Eth_eventService,Hamster_eventService],
  controllers: [],
})
export class EventModule {}
