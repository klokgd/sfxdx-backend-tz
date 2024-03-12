import { Controller, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getOrders(
    @Param() tokenA: string,
    @Param() tokenB: string,
    @Param() user: string,
    @Param() active: boolean,
  ) {
    return this.orderService.getOrders(tokenA, tokenB, user, active);
  }

  @Get()
  async getMatchingOrders(
    @Param() tokenA: string,
    @Param() tokenB: string,
    @Param() amountA: number,
    @Param() amountB: number,
  ) {
    return this.orderService.getMatchingOrders(
      tokenA,
      tokenB,
      amountA,
      amountB,
    );
  }
}
