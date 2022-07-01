import {Injectable, OnModuleInit} from '@nestjs/common';
import {Web3Service} from "./web3/web3.service";
import {PolkadotService} from "./polkadot/polkadot.service";
import { EventRecord } from '@polkadot/types/interfaces';

@Injectable()
export class AppService {

  constructor(
      private readonly web3Service: Web3Service,
      private readonly polkadotService: PolkadotService
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

}
