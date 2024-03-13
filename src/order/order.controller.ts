import { Controller, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('order')
@Controller('')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/getOrders/:tokenA/:tokenB/:user/:active')
  @ApiOperation({ summary: 'Get orders' })
  @ApiParam({ name: 'tokenA', description: 'Token A address' })
  @ApiParam({ name: 'tokenB', description: 'Token B address' })
  @ApiParam({ name: 'user', description: 'User address' })
  @ApiParam({ name: 'active', description: 'Active flag' })
  async getOrders(
    @Param('tokenA') tokenA: string,
    @Param('tokenB') tokenB: string,
    @Param('user') user: string,
    @Param('active') active: boolean,
  ) {
    return this.orderService.getOrders(tokenA, tokenB, user, active);
  }

  @Get('/getMatchingOrders/:tokenA/:tokenB/:amountA/:amountB')
  @ApiOperation({ summary: 'Get matching orders' })
  @ApiParam({ name: 'tokenA', description: 'Token A address' })
  @ApiParam({ name: 'tokenB', description: 'Token B address' })
  @ApiParam({ name: 'amountA', description: 'Amount of Token A' })
  @ApiParam({ name: 'amountB', description: 'Amount of Token B' })
  async getMatchingOrders(
    @Param('tokenA') tokenA: string,
    @Param('tokenB') tokenB: string,
    @Param('amountA') amountA: number,
    @Param('amountB') amountB: number,
  ) {
    return this.orderService.getMatchingOrders(
      tokenA,
      tokenB,
      amountA,
      amountB,
    );
  }
}
