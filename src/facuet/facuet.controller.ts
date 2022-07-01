import {Body, Controller, Post} from '@nestjs/common';
import {FacuetService} from './facuet.service';
import { RealIP } from 'nestjs-real-ip';

export class FundDto{
  address: string
}

@Controller("/api/v1/facuet")
export class FacuetController {
  constructor(private readonly facuetService: FacuetService) {}

  @Post("/request")
  async requestFund(@RealIP() ip: string, @Body() fundDto: FundDto): Promise<string> {
    return await this.facuetService.requestFunds(ip, fundDto.address)
  }
}
