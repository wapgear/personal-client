export interface IChip {
  label: string;
  color: 'success' | 'error' | 'secondary';
}

export interface IComment {
  wallet_id: string;
  owner: string;
  text: string;
  status: 'positive' | 'negative' | 'neutral';
  chips: IChip[];
  created_at: string;
}
