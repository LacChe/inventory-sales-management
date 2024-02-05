import React, { createContext, useContext, PropsWithChildren } from "react";

type StateContext = { tempField: string };

// createContext needs a default value
const defaultContext = {
  tempField: "defaultVal",
};
const Context = createContext<StateContext>(defaultContext);

export const StateContext = ({ children }: PropsWithChildren) => {
  const tempField = "tempVal";
  return <Context.Provider value={{ tempField }}>{children}</Context.Provider>;
};

export const useStateContext = () => useContext(Context);
