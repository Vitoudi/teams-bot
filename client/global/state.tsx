import React, { useState } from "react";

interface GlobalState {
  isLoggedIn: boolean;
  socket: SocketIOClient.Socket | null;
}

export type GlobalStatePropName = "isLoggedIn" | "socket";

export type GlobalStateContextType = [
  globalState: GlobalState,
  setTheme: React.Dispatch<React.SetStateAction<GlobalState>>
];

export const GlobalContext = React.createContext<GlobalStateContextType>(null);

const defaultState: GlobalState = {
  isLoggedIn: false,
  socket: null,
};

export default function GlobalContextProvider({ children }) {
  const [globalState, setGlobalState] = useState(defaultState);

  return (
    <GlobalContext.Provider value={[globalState, setGlobalState]}>
      {children}
    </GlobalContext.Provider>
  );
}
