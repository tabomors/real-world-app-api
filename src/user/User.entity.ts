import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { hashPassword, generateSalt } from '../lib/hash';

// TODO: describe active-record pattern
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

  registerUser(email: string, username: string, password: string): this {
    this.email = email;
    this.username = username;
    this.setPassword(password);
    return this;
  }

  checkPassword(password: string): boolean {
    const hashedPassword = hashPassword(password, this.salt);
    return hashedPassword === this.password;
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
