// models/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { BidRequest } from "./BidRequest";
import { SupplierProfile } from "./SupplierProfile";
import { SupplierOffer } from "./SupplierOffer";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  name!: string;

  @Column()
  password!: string;

  @Column()
  role!: "admin" | "school" | "supplier";

  @Column({ default: false })
  verified!: boolean;

  @Column({ nullable: true })
  companyName!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(() => SupplierProfile, (profile) => profile.user, { cascade: true })
  supplierProfile?: SupplierProfile;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => BidRequest, (bid) => bid.school)
  bidRequests!: BidRequest[];

  @OneToMany(() => SupplierOffer, (offer) => offer.supplier)
  offers!: SupplierOffer[];
}
