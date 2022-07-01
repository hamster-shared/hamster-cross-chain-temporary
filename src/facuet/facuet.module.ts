import {CacheModule, Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FacuetService } from './facuet.service';
import {PolkadotModule} from "../polkadot/polkadot.module";
import {FacuetController} from "./facuet.controller";

@Module({
  imports: [ConfigModule,PolkadotModule,CacheModule.register()],
  providers: [FacuetService],
  exports: [FacuetService],
  controllers: [FacuetController],
})
export class FacuetModule {}
