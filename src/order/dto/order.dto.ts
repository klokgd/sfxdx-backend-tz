export interface IOrderDTO {
  id?: number;
  tokenA: string;
  tokenB: string;
  amountA: number;
  amountB: number;
  user: string;
  isMarket: boolean;
  isActive: boolean;
}
