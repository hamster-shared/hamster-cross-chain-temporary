import '@polkadot/api-augment';
import {Injectable, OnModuleInit} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import {EventRecord} from "@polkadot/types/interfaces";
import {PolkadotService} from "../polkadot/polkadot.service";
import {Web3Service} from "../web3/web3.service";

@Injectable()
export class Hamster_eventService  implements OnModuleInit    {

  constructor(
      private readonly config: ConfigService,
      private readonly web3Service: Web3Service,
      private readonly polkadotService: PolkadotService
  ) {}

  async watchHeader() {
    let count = 0;
    const api = await this.polkadotService.buildApi()
    const unsubscribe = await api.rpc.chain.subscribeNewHeads(async (header) => {
      console.log(`Chain is at block: #${header.number}`);

      let apiAt = await api.at(header.hash)
      try {
        let events = await apiAt.query.system.events();
        console.log(`\nReceived ${events.length} events:`);

        this.dealEvents(events)
      } catch (e ){
        console.log(e)
      }
    });
  }

  dealEvents(events ) {
    for (const record of events) {
      // Extract the phase, event and the event types
      const {event, phase} = record;
      const types = event.typeDef;

      if (event.section === 'burn' && event.method === 'BurnToEth') {
        const amount = event.data[0].toString()
        const eth_address = event.data[1].toString()
        console.log(`mint to eth , address : ${eth_address}, amount: ${amount}`)
        this.web3Service.mint(eth_address, Number(amount)).then(receipt => {
          console.log(`mint success, transaction hash is ${receipt.blockHash}`)
        }).catch(error => {
          console.error("mint fail , error is : ", error)
        })
      }
    }
  }

  async watchEvent() {
    const api = await this.polkadotService.buildApi()
    try {
      api.query.system.events((events) => {
        console.log(`\nReceived ${events.length} events:`);

        // Loop through the Vec<EventRecord>

      }).catch(err => {
        console.log("query err:", err)
      });
    } catch (e) {
      console.log("try cache :", e)
    }
  }

  onModuleInit(): any {
    this.watchHeader()
        .then()
        .catch(reason => {
          console.log("watch event fail: ", reason)
        })
        .finally(() => {
        })
  }

}
