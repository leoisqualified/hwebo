// models/Delivery.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { SupplierOffer } from "./SupplierOffer";

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => SupplierOffer)
  offer!: SupplierOffer;

  @Column({ default: "pending" })
  status!: "pending" | "in_progress" | "delivered" | "rejected";

  @Column({ nullable: true })
  deliveryNotes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
