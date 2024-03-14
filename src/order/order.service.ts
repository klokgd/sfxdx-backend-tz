import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { ethers } from 'ethers';
import * as abiContract from '../libs/api.json';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { IOrderDTO } from './dto/order.dto';
import Web3, { Contract } from 'web3';
import { IMatchedOrderDto } from './dto/matchedOrder.dto';

@Injectable()
export class OrderService implements OnModuleInit {
  private readonly contract: Contract<any>;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Order) private readonly orderModel: typeof Order,
  ) {
    const infuraApiKey = this.configService.get('INFURA_API_KEY');
    const network = this.configService.get('NETWORK');
    const contractAddress = this.configService.get('CONTRACT_ADDRESS');
    const infuraEndpoint = `wss://${network}.infura.io/ws/v3/${infuraApiKey}`;
    const web3 = new Web3(new Web3.providers.WebsocketProvider(infuraEndpoint));
    this.contract = new web3.eth.Contract(abiContract, contractAddress);
  }

  onModuleInit() {
    this.listenToEvents();
  }

  private async listenToEvents() {
    this.contract.events.OrderCreated().on('connected', () => {
      console.log('OrderCreated event connected');
    });
    this.contract.events.OrderCreated().on('data', (event) => {
      const eventData = event.returnValues as unknown as IOrderDTO;

      this.createOrder(eventData);
    });

    this.contract.events.OrderMatched().on('connected', () => {
      console.log('OrderMatched event connected');
    });
    this.contract.events.OrderMatched().on('data', (event) => {
      const eventData: IMatchedOrderDto =
        event.returnValues as unknown as IMatchedOrderDto;
      this.matchOrder(eventData);
    });

    this.contract.events.OrderCancelled().on('connected', () => {
      console.log('OrderCancelled event connected');
    });
    this.contract.events.OrderCancelled().on('data', (event) => {
      const eventData = event.returnValues as unknown as { id: string };
      this.cancelOrder(eventData.id);
    });
  }

  async cancelOrder(id: string): Promise<void> {
    const order = await this.orderModel.findOne({ where: { id: id } });

    if (!order) {
      throw new Error(`Order with id ${id} not found in the database`);
    }

    order.isActive = false;
    await order.save();
  }

  async matchOrder(matchedOrder: IMatchedOrderDto): Promise<void> {
    const { id, amountLeftToFill } = matchedOrder;

    const order = await this.orderModel.findOne({ where: { id: id } });

    if (!order) {
      throw new Error(`Order with id ${id} not found in the database`);
    }

    order.amountA = amountLeftToFill;

    if (amountLeftToFill === 0) {
      order.isActive = false;
    }

    await order.save();
  }

  async createOrder(order: IOrderDTO): Promise<void> {
    const { id, amountA, amountB, tokenA, tokenB, user, isMarket } = order;
    this.orderModel.create({
      id: id,
      amountA: amountA,
      amountB: amountB,
      tokenA: tokenA,
      tokenB: tokenB,
      user: user,
      isMarket: isMarket,
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
