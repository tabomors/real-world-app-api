import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  CreateDateColumn
} from 'typeorm';

@Entity({ name: 'subscriptions' })
export class Subscription extends BaseEntity {
  @PrimaryColumn()
  user_id!: number;

  @PrimaryColumn()
  following_id!: number;

  @CreateDateColumn()
  created_at!: Date;

  static async isFollowing(
    userId: number,
    followingId: number
  ): Promise<boolean> {
    const subscription = await Subscription.findOne({
      where: { user_id: userId, following_id: followingId },
    });
    return !!subscription;
  }
}
