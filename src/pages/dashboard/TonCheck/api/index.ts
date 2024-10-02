import { QueryFunction } from '@tanstack/react-query';
import { IComment } from '../types.ts';

interface GetWalletResponse {
  comments: IComment[];
}

const tonCheckApi = 'http://localhost:4001/api';

export const getWalletFn: QueryFunction<GetWalletResponse> = async ({ queryKey: [, wallet] }) => {
  if (!wallet) throw new Error('Wallet is required');
  const response = await fetch(`${tonCheckApi}/get/${wallet}`);

  if (!response.ok) {
    const error = ((await response.json()) as any)?.error || 'Failed to fetch wallet';
    throw {
      status: response.status,
      message: error,
    };
  }
  return response.json();
};

// export const postCommentFn: MutationFunction<GetWalletResponse> = async ({ queryKey: [, wallet], comment }) => {
//   const response = await fetch(`${tonCheckApi}/create`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       wallet_id: wallet,
//       text: comment.text,
//       status: comment.status,
//       owner: comment.owner,
//     }),
//   });
//
//   if (!response.ok) {
//     const error = ((await response.json()) as any)?.error || 'Failed to post comment';
//     throw {
//       status: response.status,
//       message: error,
//     };
//   }
//   return response.json();
// };
