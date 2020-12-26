import { ArticleResponse } from './Article.types';
import { Article } from './Article.entity';
import { User } from '../user/User.entity';

export const mapArticleModelToArticleResponse = (input: {
  article: Article;
  user: User;
  favorited: boolean;
  following: boolean;
}): ArticleResponse => {
  const { article, user, favorited, following } = input;
  return {
    title: article.title,
    slug: article.slug,
    description: article.description,
    body: article.body,
    favorited,
    favoritesCount: article.favorites_count,
    tagList: article.tags.map((tag) => tag.title),
    createdAt: article.created_at.toISOString(),
    updatedAt: article.updated_at.toISOString(),
    author: {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following,
    },
  };
};
