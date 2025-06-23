// models/Payment.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { SupplierOffer } from "./SupplierOffer";
import { User } from "./User";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => SupplierOffer)
  offer!: SupplierOffer;

  @ManyToOne(() => User)
  school!: User;

  @Column("decimal", { precision: 12, scale: 2 })
  totalAmount!: number;

  @Column()
  paymentMethod!: "mobile_money" | "bank_card";

  @Column({ default: "pending" })
  status!: "pending" | "paid" | "failed";

  @Column({ nullable: true })
  transactionReference?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
