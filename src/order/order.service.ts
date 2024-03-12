import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as abiContract from '../libs/api.json';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { IOrderDTO } from './dto/order.dto';

@Injectable()
export class OrderService implements OnModuleInit {
  private readonly provider: ethers.JsonRpcProvider;
  private readonly contract: ethers.Contract;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Order) private readonly orderModel: typeof Order,
  ) {
    const infuraApiKey = this.configService.get('INFURA_API_KEY');
    const network = this.configService.get('NETWORK');
    const contractAddress = this.configService.get('CONTRACT_ADDRESS');
    this.provider = new ethers.InfuraProvider(network, infuraApiKey);
    this.contract = new ethers.Contract(
      contractAddress,
      abiContract,
      this.provider,
    );
  }

  onModuleInit() {
    this.listenToEvents();
  }

  private async listenToEvents() {
    this.contract.on('OrderCreated', (order: any) => {
      console.log('Order created:', order);
    });

    this.contract.on('OrderMatched', (order: any) => {
      console.log('Order matched:', order);
    });

    this.contract.on('OrderCancelled', (order: any) => {
      console.log('Order cancelled:', order);
    });
  }

  async getOrders(
    tokenA?: string,
    tokenB?: string,
    user?: string,
    active?: boolean,
  ): Promise<IOrderDTO[]> {
    const orders = await this.orderModel.findAll({
      where: {
        ...(tokenA && { tokenA }),
        ...(tokenB && { tokenB }),
        ...(user && { user }),
        ...(active !== undefined && { isActive: active }),
      },
    });
    return orders;
  }

  async getMatchingOrders(
    tokenA: string,
    tokenB: string,
    amountA: number,
    amountB: number,
  ): Promise<IOrderDTO[]> {
    const matchingOrders: IOrderDTO[] = await this.orderModel.findAll({
      where: { tokenA, tokenB, amountA, amountB },
    });

    return matchingOrders;
  }
}
