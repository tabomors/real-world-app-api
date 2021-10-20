import { ArticleResponse, CommentResponse } from './Article.types';
import { Article } from './Article.entity';
import { Comment } from './Comment.entity';
import { User } from '../user/User.entity';

export const mapArticleModelToArticleResponse = (input: {
  article: Article;
  author: User;
  favorited: boolean;
  following: boolean;
}): ArticleResponse => {
  const { article, author, favorited, following } = input;
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
      username: author.username,
      bio: author.bio,
      image: author.image,
      following,
    },
  };
};

export const mapCommentModelToCommentResponse = (input: {
  comment: Comment;
  author: User;
  following: boolean;
}): CommentResponse => {
  const { comment, author, following } = input;
  return {
    body: comment.body,
    id: comment.id,
    createdAt: comment.created_at.toISOString(),
    updatedAt: comment.created_at.toISOString(),
    author: {
      following,
      username: author.username,
      bio: author.bio,
      image: author.image,
    },
  };
};
