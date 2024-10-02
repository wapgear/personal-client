import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Account, JettonsBalances } from 'tonapi-sdk-js';

export interface JettonsBalancesWithTimestamp extends JettonsBalances {
  timestamp: number;
}

export interface NormalizedJetton {
  name: string;
  symbol: string;
  priceInUsd: string;
  priceInTon: number;
  totalPriceInUsd: number;
  totalPriceInTon: number;
  diff: string;
  balance: string;
  image: string;
}

export interface Store {
  isDrawerOpen: boolean;
  account: Account | null;
  setAccount: (account: Account | null) => void;

  jettons: JettonsBalancesWithTimestamp & {
    timestamp: number;
  };

  setJettons: (jettons: JettonsBalancesWithTimestamp['balances']) => void;

  normalizedJettons: () => NormalizedJetton[];

  setIsDrawerOpen: (value: boolean) => void;
}

export const useDashboardStore = create(
  persist<Store>(
    (set, get) => ({
      isDrawerOpen: false,
      account: null,
      setAccount: (account: Account | null) => set({ account }),

      jettons: {
        balances: [],
        timestamp: 0,
      },

      setJettons: (balances: JettonsBalancesWithTimestamp['balances']) =>
        set({
          jettons: {
            balances,
            timestamp: Date.now(),
          },
        }),

      normalizedJettons: () =>
        get()?.jettons.balances.map((item) => {
          const balance = Number(item.balance) * 0.000000001;
          const priceInUsd = item.price?.prices?.USD ?? 0;
          const priceInTon = item.price?.prices?.TON ?? 0;
          const totalPriceInUsd = priceInUsd * balance;
          const totalPriceInTon = priceInTon * balance;

          return {
            name: item.jetton.name,
            symbol: item.jetton.symbol,
            priceInUsd: humanizePrice(priceInUsd),
            priceInTon,
            totalPriceInTon,
            totalPriceInUsd,
            balance: balance.toFixed(2),
            diff: item.price?.diff_24h?.USD ?? '?',
            image: item.jetton.image,
          };
        }) || [],

      setIsDrawerOpen: (isDrawerOpen: boolean) => set({ isDrawerOpen }),
    }),
    {
      name: 'dashboard-store',
      version: 1,
    },
  ),
);

const humanizePrice = (price: number) => {
  // 0.00009662503484157378$ -> 0.000097$
  // 0.02125 -> 0.02125$
  // 0.00023151 -> 0.000231$
  return price.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
};
