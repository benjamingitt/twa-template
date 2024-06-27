import { useState } from "react";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract } from "ton-core";
import { useQuery } from "@tanstack/react-query";
import BlumGame from "../contracts/BlumGame";

export function useBlumGameContract() {
  const { client } = useTonClient();
  const { sender } = useTonConnect();

  const blumGameContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new BlumGame(
      Address.parse("EQB8StgTQXidy32a8xfu7j4HMoWYV0b0cFM8nXsP2cza_b7Y") // replace with your deployed contract address
    );
    return client.open(contract) as OpenedContract<BlumGame>;
  }, [client]);

  const { data, isFetching } = useQuery(
    ["blumGameState"],
    async () => {
      if (!blumGameContract) return null;
      return blumGameContract.getGameState();
    },
    { refetchInterval: 5000 }
  );

  return {
    currentPrice: isFetching ? null : data?.currentPrice.toString(),
    totalBets: isFetching ? null : data?.totalBets.toString(),
    placeBet: (amount: bigint, betUp: boolean) => {
      return blumGameContract?.placeBet(sender, amount, betUp);
    },
    updatePrice: (newPrice: bigint) => {
      return blumGameContract?.updatePrice(sender, newPrice);
    },
  };
}
