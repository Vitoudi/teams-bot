import React, { useState } from "react";

interface GlobalState {
  isLoggedIn: boolean;
  socket: SocketIOClient.Socket | null;
  jsonToken: string;
  apiUrl: string
}

export type GlobalStatePropName = "isLoggedIn" | "socket" | 'jsonToken';

export type GlobalStateContextType = [
  globalState: GlobalState,
  setTheme: React.Dispatch<React.SetStateAction<GlobalState>>
];

export const GlobalContext = React.createContext<GlobalStateContextType>(null);

const defaultState: GlobalState = {
  isLoggedIn: false,
  socket: null,
  jsonToken: "",
  apiUrl: "http://localhost:8000",
};

export default function GlobalContextProvider({ children }) {
  const [globalState, setGlobalState] = useState(defaultState);

  return (
    <GlobalContext.Provider value={[globalState, setGlobalState]}>
      {children}
    </GlobalContext.Provider>
  );
}
