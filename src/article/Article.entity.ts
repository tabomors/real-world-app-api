import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { User } from '../user/User.entity';
import { Comment } from './Comment.entity';
import { Tag } from './Tag.entity';

@Entity({ name: 'articles' })
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false, unique: true })
  slug!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  body?: string;

  @Column({ nullable: false })
  author_id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author!: User;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments!: Comment[];

  @ManyToMany(() => Tag, { eager: true })
  @JoinTable()
  tags!: Tag[];

  @Column({ default: 0 })
  favorites_count!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
