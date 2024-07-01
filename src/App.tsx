import React from "react";
import "./App.css";
import styled from "styled-components";
import { BlumGame } from "./components/BlumGame";
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

function App() {
  const { isInTelegram } = useTelegramWebApp();

  return (
    <StyledApp>
      <AppContainer>
        {isInTelegram ? (
          <BlumGame />
        ) : (
          <p>Please open this app in Telegram.</p>
        )}
      </AppContainer>
    </StyledApp>
  );
}

export default App;
