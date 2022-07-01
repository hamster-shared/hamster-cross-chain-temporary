import '@polkadot/api-augment';
import {CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {PolkadotService} from "../polkadot/polkadot.service";
import {Cache} from "cache-manager";

@Injectable()
export class FacuetService {

  private overdue: number = 24 * 3600;

  constructor(private readonly config: ConfigService,
              private readonly polkadotService: PolkadotService,
              @Inject(CACHE_MANAGER) private cacheManager: Cache
              ) {

  }


  async requestFunds(ip: string, address: string): Promise<string> {

    // console.log("ip is : ", ip)
    //
    const ipKey = `ip::${ip}`
    // const ipRecord = await this.cacheManager.get<String>(ipKey)
    //
    // if (ipRecord ) {
    //   return Promise.reject(new HttpException("You have already applied in the past day",HttpStatus.BAD_REQUEST))
    // }

    const addressKey = `address::${address}`
    const addressRecord = await this.cacheManager.get<String>(addressKey)

    if (addressRecord) {
      return Promise.reject(new HttpException("You have already applied in the past day",HttpStatus.BAD_REQUEST))
    }

    const sent = 1000 * Math.pow(10,12)
    const seed = this.config.get<String>("hamster.account.seed")
    return new Promise((resolve,rejects) => {
      this.polkadotService.transfer(seed, address, sent).then(msg => {
        if (msg === 'success' ) {
          this.cacheManager.set(ipKey,"1",{ttl: this.overdue })
          this.cacheManager.set(addressKey, "1", {ttl: this.overdue})
          resolve('success')
        }
        return rejects(new HttpException("fail",HttpStatus.BAD_REQUEST))
      }).catch(err => {
        rejects(new HttpException(err.toString(),HttpStatus.BAD_REQUEST))
      })
    } )


  }
}

