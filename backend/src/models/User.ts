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

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: "admin" | "school" | "supplier";

  @Column({ default: false })
  verified!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(() => SupplierProfile, (profile) => profile.user)
  supplierProfile!: SupplierProfile;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => BidRequest, (bid) => bid.school)
  bidRequests!: BidRequest[];
}
