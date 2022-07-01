import '@polkadot/api-augment';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';

@Injectable()
export class PolkadotService  {
  api: ApiPromise | undefined;

  constructor(private readonly config: ConfigService) {}

  async buildApi() : Promise<ApiPromise> {
    if (!this.api) {
      const wsProvider = new WsProvider(this.config.get('hamster.endpoint'));
      this.api = await ApiPromise.create({ provider: wsProvider });
    }
    return this.api;
  }


  async transfer(seed,dest: string, balance: number) : Promise<String> {
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
    const keyringPair = keyring.addFromSeed(seed);
    const apiPromise = await this.buildApi();
    await apiPromise.tx.balances.transfer(dest, balance).signAndSend(keyringPair, (result) => {
      if (result.status.isInBlock) {
        console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
      } else if (result.status.isFinalized) {
        console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
      }
    });

    return "success"
  }

  async mint(address: string, amount: number): Promise<any>{
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
    const keyringPair = keyring.addFromSeed(this.config.get("hamster.account.seed"));
    const api = await this.buildApi();

    api.tx.burn.mint(amount,address).signAndSend(keyringPair, (result) => {
      if (result.status.isInBlock) {
        console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
      } else if (result.status.isFinalized) {
        console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
      }
    });
  }

  // async testApplyFreeResource(): Promise<any>{
  //
  //   const api = await this.buildApi();
  //   const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
  //   const keyringPair = keyring.addFromSeed(this.config.get("hamster.account.seed"));
  //
  //   // 参数说明：
  //   // 0: cpu, 1: mem, 2: 租用时长，3："公钥" 4： 部署类型
  //   api.tx.resourceOrder.applyFreeResource(1,1,1,"publickey",1).signAndSend(keyringPair, (result) => {
  //     if (result.status.isInBlock) {
  //       console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
  //     } else if (result.status.isFinalized) {
  //       console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
  //
  //       result.events.filter(({ event }) =>
  //           api.events.system.ExtrinsicFailed.is(event)
  //       ).forEach(({ event: { data: [error, info] } }) => {
  //           const decoded =  api.registry.findMetaError(result.dispatchError.asModule)
  //           const { docs, method, section } = decoded;
  //           console.log(`${section}.${method}: ${docs.join(' ')}`);
  //           console.log(error.toString());
  //       });
  //     }
  //   });
  // }

  // async testReleaseResource(): Promise<any>{
  //   const api = await this.buildApi();
  //   const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
  //   const keyringPair = keyring.addFromSeed(this.config.get("hamster.account.seed"));
  //
  //   // 查询在链上查询用户占用的资源订单序号
  //   const orderNumber = await api.query.resourceOrder.applyUsers(keyringPair.address)
  //   if (orderNumber.toJSON() > 0 ) {
  //     // 根据订单序号取消资源占用
  //     api.tx.resourceOrder.releaseApplyFreeResource(orderNumber.toJSON()).signAndSend(keyringPair, (result) => {
  //       if (result.status.isInBlock) {
  //         console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
  //       } else if (result.status.isFinalized) {
  //         console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
  //
  //         result.events.filter(({event}) =>
  //             api.events.system.ExtrinsicFailed.is(event)
  //         ).forEach(({event: {data: [error, info]}}) => {
  //           const decoded = api.registry.findMetaError(result.dispatchError.asModule)
  //           const {docs, method, section} = decoded;
  //           console.log(`${section}.${method}: ${docs.join(' ')}`);
  //           console.log(error.toString());
  //         });
  //       }
  //     });
  //   }
  // }
}

