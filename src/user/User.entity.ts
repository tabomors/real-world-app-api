import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { hashPassword, generateSalt } from '../lib/hash';
import { Article } from '../article/Article.entity';
import { Subscription } from '../profile/Subscription.entity';

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

  @OneToMany(() => Article, (article) => article.author)
  articles?: Article[];

  @ManyToMany(() => Article)
  @JoinTable()
  favorites!: Article[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  following!: Promise<Subscription[]>;

  @OneToMany(() => Subscription, (subscription) => subscription.following_user)
  followers!: Promise<Subscription[]>;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
