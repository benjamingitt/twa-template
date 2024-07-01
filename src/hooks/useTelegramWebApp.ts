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
    
    const initDataUnsafe = WebApp.initDataUnsafe;
    if (initDataUnsafe.user) {
      setUser(initDataUnsafe.user);
    }
  }, []);

  return { user };
}
