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

  useEffect(() => {
    WebApp.ready();

    const initData = WebApp.initData || '';
    if (initData) {
      try {
        const parsedInitData = JSON.parse(decodeURIComponent(initData));
        if (parsedInitData.user) {
          setUser(parsedInitData.user);
        }
      } catch (error) {
        console.error('Failed to parse Telegram WebApp init data:', error);
      }
    }
  }, []);

  return { user };
}
