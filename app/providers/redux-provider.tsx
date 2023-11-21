"use client";

import { createContext } from "react";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";

// export const ReduxContext = createContext({});

export default function ReduxProvider({ children }: PropsWithChildren) {
  return <Provider store={store}>{children}</Provider>;
}
