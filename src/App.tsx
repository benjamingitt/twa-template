import React, { useState } from "react";
import "./App.css";
import styled from "styled-components";
import { BlumGame } from "./components/BlumGame";
import { Wallet } from "./components/Wallet";
import { Button, FlexBoxRow } from "./components/styled/styled";
import { useTelegramWebApp } from "./hooks/useTelegramWebApp";

const StyledApp = styled.div`
  background-color: var(--tg-theme-bg-color, #e8e8e8);
  color: var(--tg-theme-text-color, black);
  min-height: 100vh;
  padding: 20px 20px;
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const TabButton = styled(Button)<{ active: boolean }>`
  background-color: ${props => props.active ? 'var(--tg-theme-button-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--tg-theme-button-text-color)' : 'var(--tg-theme-text-color)'};
  border: 1px solid var(--tg-theme-button-color);
  margin-right: 10px;
`;



function App() {
  const [activeTab, setActiveTab] = useState<'game' | 'wallet'>('game');
  const { isInTelegram } = useTelegramWebApp();

  return (
    <StyledApp>
      <AppContainer>
        {isInTelegram ? (
          <>
            <FlexBoxRow style={{ justifyContent: 'center', marginBottom: '20px' }}>
              <TabButton 
                active={activeTab === 'game'} 
                onClick={() => setActiveTab('game')}
              >
                Game
              </TabButton>
              <TabButton 
                active={activeTab === 'wallet'} 
                onClick={() => setActiveTab('wallet')}
              >
                Wallet
              </TabButton>
            </FlexBoxRow>
            {activeTab === 'game' ? <BlumGame /> : <Wallet />}
          </>
        ) : (
          <p>Please open this app in Telegram.</p>
        )}
      </AppContainer>
    </StyledApp>
  );
}

export default App;