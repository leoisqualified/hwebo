// models/BidRequest.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { BidItem } from "./BidItem";

@Entity()
export class BidRequest {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.bidRequests)
  school!: User;

  @Column()
  title!: string;

  @Column({ nullable: true })
  budget!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "timestamp" })
  deadline!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => BidItem, (item) => item.bidRequest, { cascade: true })
  items!: BidItem[];
}
