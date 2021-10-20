import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Article } from './Article.entity';
import { User } from '../user/User.entity';

@Entity({ name: 'comments' })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  body!: string;

  @ManyToOne(() => Article, (article) => article.comments)
  @JoinColumn({ name: 'article_id', referencedColumnName: 'id' })
  article!: Article;

  @Column({ nullable: false, unique: false })
  author_id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
