import { create } from 'zustand';
import type { IComment } from './types.ts';

interface Store {
  comments: {
    [key: string]: IComment[];
  };
  addComment: (comments: IComment[]) => void;
}

export const useTonCheckStore = create<Store>((set) => ({
  comments: {},
  addComment: (comments: IComment[]) => {
    set((state) => {
      const firstComment = comments?.[0];
      if (!firstComment) return state;

      return {
        comments: {
          ...state.comments,
          [firstComment.wallet_id]: comments,
        },
      };
    });
  },
}));
