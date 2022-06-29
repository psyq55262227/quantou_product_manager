import { createContext } from 'react';

export const GlobalContext = createContext<{
  theme?: string;
  setTheme?: (value: string) => void;
}>({});
