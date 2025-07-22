// models/Delivery.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { SupplierOffer } from "./SupplierOffer";

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => SupplierOffer)
  @JoinColumn()
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
