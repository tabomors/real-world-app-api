import slug from 'slug';

export const slugify = (title: string) => {
  return (
    slug(title, { lower: true }) +
    '-' +
    ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
  );
};

export const parseNumberLikeQP = (qp?: string) => {
  const parsedLimit = parseInt(qp?.toString() || '', 10);
  return isNaN(parsedLimit) ? undefined : parsedLimit;
}
