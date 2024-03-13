import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export class Order extends Model {
  @PrimaryKey
  @Column({ type: 'BIGINT' })
  id: number;

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

  isMarket: boolean;
}
