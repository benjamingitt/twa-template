import React from 'react';
import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonConnect } from "../hooks/useTonConnect";
import { Card, FlexBoxCol } from "./styled/styled";

export function Wallet() {
  const { wallet } = useTonConnect();

  return (
    <Card>
      <FlexBoxCol>
        <h2>Wallet</h2>
        <TonConnectButton />
        {wallet && (
          <p>Connected wallet: {wallet.slice(0, 6)}...{wallet.slice(-4)}</p>
        )}
      </FlexBoxCol>
    </Card>
  );
}
