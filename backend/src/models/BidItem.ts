// models/BidItem.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { BidRequest } from "./BidRequest";
import { SupplierOffer } from "./SupplierOffer";

@Entity()
export class BidItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  itemName!: string; // e.g., "Maize"

  @Column("decimal", { precision: 10, scale: 2 })
  quantity!: number;

  @Column()
  unit!: string; // e.g., "sacks"

  @Column({ nullable: true })
  category!: string;

  @Column({ default: "open" })
  status!: string; // e.g. 'open', 'closed'

  @Column({ type: "text", nullable: true })
  description!: string;

  @ManyToOne(() => BidRequest, (bidRequest) => bidRequest.items, {
    onDelete: "CASCADE",
  })
  bidRequest!: BidRequest;

  @OneToMany(() => SupplierOffer, (offer) => offer.bidItem)
  offers!: SupplierOffer[];

  @CreateDateColumn()
  createdAt!: Date;
}
