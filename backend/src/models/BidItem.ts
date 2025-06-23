// models/BidItem.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { BidRequest } from "./BidRequest";
import { SupplierOffer } from "./SupplierOffer";

@Entity()
export class BidItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => BidRequest, (bid) => bid.items)
  bidRequest!: BidRequest;

  @Column()
  itemName!: string; // e.g., "Maize"

  @Column("decimal", { precision: 10, scale: 2 })
  quantity!: number;

  @Column()
  unit!: string; // e.g., "sacks"

  @OneToMany(() => SupplierOffer, (offer) => offer.bidItem)
  offers!: SupplierOffer[];
}
