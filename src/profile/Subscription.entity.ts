import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/User.entity';

@Entity({ name: 'subscriptions' })
export class Subscription extends BaseEntity {
  @PrimaryColumn()
  user_id!: number;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @PrimaryColumn()
  following_id!: number;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'following_id' })
  following_user!: User;

  @CreateDateColumn()
  created_at!: Date;

  static async isFollowing(userId: number, followingId: number): Promise<boolean> {
    const subscription = await Subscription.findOne({
      where: { user_id: userId, following_id: followingId },
    });
    return !!subscription;
  }
}
