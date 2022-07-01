import '@polkadot/api-augment';
import {Injectable, OnModuleInit} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import {Web3Service} from "../web3/web3.service";
import {PolkadotService} from "../polkadot/polkadot.service";
const Contract = require('web3-eth-contract')
const Web3 = require('web3');

@Injectable()
export class Eth_eventService implements OnModuleInit  {

    constructor(
      private readonly config: ConfigService,
      private readonly web3Service: Web3Service,
      private readonly polkadotService: PolkadotService
  ) {

    }

  async watchBurn() {

    const web3 = new Web3(Web3.givenProvider || this.config.get("web3.ws_endpoint"));
    const abi = this.config.get("contract.abi");
    const contract = new web3.eth.Contract(abi, this.config.get("contract.address"));

    let polkadot = this.polkadotService;
    contract.events.TransferToHamster({
    },function (err, event) {

    }).on("connected", function(subscriptionId){
      console.log(subscriptionId);
    }).on('data', function(event){
          console.log(event); // same results as the optional callback above
          const burner = event.returnValues.from
          const burnValue = event.returnValues.value
          const polkadotAddress = event.returnValues.polkadotAddress
          console.log(`burn user is ${burner}, burn value is ${burnValue}, to polkadot address is ${polkadotAddress}`)
          polkadot.mint(polkadotAddress,burnValue).then(() => {
              console.log("success")
          }).catch(err => {
              console.error(err)
          })
        })
        .on('changed', function(event){
          // remove event from local database
        })
        .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          console.log(error)
        });
  }

  onModuleInit(): any {
      this.watchBurn().then().catch(err => {
          console.log(err)
      })
  }
}
