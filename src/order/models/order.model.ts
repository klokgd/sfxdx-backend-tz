import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Order extends Model {
  @Column
  tokenA: string;

  @Column
  tokenB: string;

  @Column
  amountA: number;

  @Column
  amountB: number;

  @Column
  user: string;

  @Column({ defaultValue: true })
  isActive: boolean;
}
