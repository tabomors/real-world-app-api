import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { hashPassword, generateSalt } from '../lib/hash';

export type CreateUserParams = {
  email: string;
  username: string;
  password: string;
};

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column()
  salt!: string;

  registerUser(params: CreateUserParams): this {
    this.email = params.email;
    this.username = params.username;
    this.setPassword(params.password);
    return this;
  }

  setPassword(password: string): void {
    const salt = generateSalt();
    this.salt = salt;
    this.password = hashPassword(password, salt);
  }

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  image?: string;
}
