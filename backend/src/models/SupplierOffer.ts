// models/SupplierOffer.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { BidItem } from "./BidItem";
import { Delivery } from "./Delivery";

@Entity()
export class SupplierOffer {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User)
  supplier!: User;

  @ManyToOne(() => BidItem, (item) => item.offers)
  bidItem!: BidItem;

  @Column("decimal", { precision: 10, scale: 2 })
  pricePerUnit!: number;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ default: "pending" })
  status!: "pending" | "accepted" | "rejected";

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  totalPrice!: number;

  @Column({ type: "varchar", nullable: true })
  deliveryTime!: string;

  @Column({ default: false })
  paid!: boolean;

  @OneToOne(() => Delivery, (delivery) => delivery.offer)
  delivery?: Delivery;
}
