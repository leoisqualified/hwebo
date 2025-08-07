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

export enum VerificationStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  FAILED = "failed",
}

@Entity()
export class SupplierProfile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => User, (user) => user.supplierProfile)
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

  @Column({
    type: "enum",
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verificationStatus!: VerificationStatus;

  @CreateDateColumn()
  submittedAt!: Date;
}
