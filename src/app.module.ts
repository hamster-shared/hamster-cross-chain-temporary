import {Module} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { Web3Module } from "./web3/web3.module";
import { PolkadotModule }  from "./polkadot/polkadot.module";
import {EventModule} from "./event/event.module";
import {FacuetModule} from "./facuet/facuet.module";

const appImports = [
    ConfigModule.forRoot({ load: [configuration] }),
];

@Module({
  imports: [...appImports,Web3Module,PolkadotModule,EventModule,FacuetModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
