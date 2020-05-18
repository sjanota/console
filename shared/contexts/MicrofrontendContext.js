import React, { createContext, useContext, useState, useEffect } from 'react';
import LuigiClient from '@kyma-project/luigi-client';

export const MicrofrontendContext = createContext({});

export function MicrofrontendContextProvider({ children }) {
  const [context, setContext] = useState(LuigiClient.getContext());

  useEffect(() => {
    const initHandle = LuigiClient.addInitListener(setContext);
    const updateHandle = LuigiClient.addContextUpdateListener(setContext);

    return () => {
      LuigiClient.removeContextUpdateListener(updateHandle);
      LuigiClient.removeInitListener(initHandle);
    };
  }, []);

  console.log(context);

  return (
    <MicrofrontendContext.Provider value={context}>
      {children}
    </MicrofrontendContext.Provider>
  );
}

export function useModuleEnabled(module) {
  const { backendModules } = useMicrofrontendContext();
  return backendModules && backendModules.includes(module);
}

export function useMicrofrontendContext() {
  return useContext(MicrofrontendContext);
}

export const withMicrofrontendContext = Component => props => (
  <MicrofrontendContextProvider.Consumer>
    {value => <Component {...props} context={value} />}
  </MicrofrontendContextProvider.Consumer>
);
