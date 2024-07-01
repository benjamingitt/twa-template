import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

export function useTelegramWebApp() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isInTelegram, setIsInTelegram] = useState(false);

  useEffect(() => {
    const initDataUnsafe = WebApp.initDataUnsafe;
    setIsInTelegram(!!WebApp.initData);
    
    if (initDataUnsafe.user) {
      setUser(initDataUnsafe.user);
    }

    WebApp.ready();
  }, []);

  return { user, isInTelegram };
}
