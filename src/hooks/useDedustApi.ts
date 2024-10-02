import axios from "axios";
import { useCallback, useMemo } from "react";

const baseURL = "https://api.dedust.io";

const api = axios.create({
  baseURL
});

export const useDedustApi = () => {
  const getAssets = useCallback((address: string) => {
    return api.get(`/v2/accounts/${address}/assets`);
  }, []);

  const getLiquidityProviders = useCallback((address: string) => {
    return api.get(`/v1/pools/${address}/liquidity-providers`);
  }, []);

  return useMemo(() => ({
    getAssets,
    getLiquidityProviders
  }), [getAssets, getLiquidityProviders]);
};
