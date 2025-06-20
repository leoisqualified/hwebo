// models/SupplierProfile.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class SupplierProfile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;

  @Column()
  businessName!: string;

  @Column()
  registrationNumber!: string;

  @Column()
  taxId!: string;

  @Column()
  contactPerson!: string;

  @Column()
  phoneNumber!: string;

  @Column()
  fdaLicenseUrl!: string;

  @Column()
  registrationCertificateUrl!: string;

  @Column()
  ownerIdUrl!: string;

  @Column({ nullable: true })
  momoNumber?: string;

  @Column({ nullable: true })
  bankAccount?: string;

  @CreateDateColumn()
  submittedAt!: Date;
}
