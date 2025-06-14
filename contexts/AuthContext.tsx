import * as SecureStore from 'expo-secure-store';
import { createContext, use, useCallback, useEffect, useReducer, type PropsWithChildren } from 'react';
import { Platform } from 'react-native';

const AuthContext = createContext<{
   signIn: () => Promise<void>;
   signOut: () => Promise<void>;
   session?: string | null;
   isLoading: boolean;
}>({
   signIn: async () => {},
   signOut: async () => {},
   session: null,
   isLoading: true,
});

export function useSession() {
   const value = use(AuthContext);
   if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
   }

   return value;
}

export default function SessionProvider({ children }: PropsWithChildren) {
   const [[isLoading, session], setSession] = useStorageState('session');

   return (
   <AuthContext.Provider
      value={{
      signIn: async () => {
         // Perform sign-in logic here
         setSession('xxx');
      },
      signOut: async () => {
         setSession(null);
      },
      session,
      isLoading,
      }}>
      {children}
   </AuthContext.Provider>
   );
   }

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  // Public
  const [state, setState] = useAsyncState<string>();

  // Get
  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          setState(localStorage.getItem(key));
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      SecureStore.getItemAsync(key).then(value => {
        setState(value);
      });
    }
  }, [key]);

  // Set
  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}

