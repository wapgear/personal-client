import { useEffect } from "react";
import { tonApiClient } from "../tonApiClient.ts";
import { useDashboardStore } from "../store.ts";
import { useTonAddress } from "@tonconnect/ui-react";
import { useDedustApi } from "./useDedustApi.ts";

export const useTonMagic = () => {
  const { account, setAccount, jettons, setJettons } = useDashboardStore();
  const dedustApi = useDedustApi();
  const fullAddress = useTonAddress(false);

  useEffect(() => {
    if (fullAddress) {
      dedustApi.getLiquidityProviders(fullAddress).then(result => {
        console.log("huh?", result);
      });
    }
  }, [dedustApi, fullAddress]);

  useEffect(() => {
    if (fullAddress && !account) {
      tonApiClient.accounts.getAccount(fullAddress).then(setAccount);
    }
  }, [account, fullAddress, setAccount]);

  useEffect(() => {
    if (fullAddress && Date.now() - jettons.timestamp > 1000 * 30) {
      tonApiClient.accounts.getAccountJettonsBalances(fullAddress, {
        currencies: ["ton,usd"]
      }).then(({ balances }) => {
        setJettons(balances);
      });

    }
  }, [fullAddress, jettons.timestamp, setJettons]);
};
