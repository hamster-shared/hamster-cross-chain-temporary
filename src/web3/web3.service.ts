import '@polkadot/api-augment';
import {Injectable, OnModuleInit} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Contract = require('web3-eth-contract')
const Web3 = require('web3');

@Injectable()
export class Web3Service implements OnModuleInit {
  http_web3: typeof Web3 | undefined;
  http_contract : typeof Contract | undefined;
  eth_address: string


  constructor(private readonly config: ConfigService) {
    console.log(config.get("web3.endpoint"))
    console.log(config.get("contract.address"))

    const provider = new HDWalletProvider(
        {
            // mnemonic: {
            //     phrase:  config.get<string>('web3.mnemonic')
            // },
            privateKeys: [config.get<string>('web3.privateKey')],
            providerOrUrl: config.get<string>("web3.http_endpoint")
        }
    );

    this.eth_address = provider.getAddress(0);
    this.http_web3 = new Web3(provider);

    const abi = config.get("contract.abi");

    this.http_contract = new this.http_web3.eth.Contract(abi, config.get("contract.address"));

  }

    async mint(address: string,amount: number): Promise<any> {
        return new Promise(((resolve,reject) => {
            this.http_web3.eth.getTransactionCount(this.eth_address).then(data => {
                console.log("nonce:",data)
                this.http_contract.methods.mint(address, amount).send({
                    from: this.eth_address,
                    nonce: data,
                }).on('transactionHash', function (hash) {
                    console.log('transactionHash:',hash)
                }).on('receipt', function (receipt) {
                    // receipt example
                    console.log("receipt:",receipt);
                    resolve(reject)
                }).on('error',function (error) {
                    console.log('error:', error)
                    reject(error)
                })
            }).catch(err => {
                reject(err)
            })

        }))
    }

    onModuleInit(): any {

      // this.mint("0x9F179dD7ba4252a90a37a33cB977578DC4Bb041a",100).then(() => {
      //     console.log('mint success')
      // }).catch(err => {
      //     console.log('mint err:', err)
      // })
    }

}
