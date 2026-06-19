'use client';

import { useEffect } from 'react';
import { checkSession } from '@/lib/api/clientApi'; 
import { useAuthStore } from '@/lib/store/authStore';

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resData = await checkSession(); 
        
        if (resData && !('success' in resData)) {
          console.log('USER:', resData);
          setUser(resData); 
        } else {
          console.log('NO SESSION OR BAD RESPONSE:', resData);
          clearIsAuthenticated();
        }
      } catch (error) {
        console.log('ERROR:', error);
        clearIsAuthenticated();
      }
    };

    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}