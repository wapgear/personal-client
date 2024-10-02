import type { IComment } from '../types';
import { useMemo } from 'react';

export const useCommentsToData = (comments: IComment[]) => {
  const { totalRating, positive, negative } = comments.reduce(
    (acc, { status }) => {
      if (status === 'positive') {
        acc.positive++;
        acc.totalRating++;
      }
      if (status === 'negative') {
        acc.negative++;
        acc.totalRating--;
      }
      return acc;
    },
    { totalRating: 0, positive: 0, negative: 0 },
  );

  return useMemo(
    () => ({
      totalRating,
      positive,
      negative,
    }),
    [totalRating, positive, negative],
  );
};
