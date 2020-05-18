import React, { createContext, useContext, useState, useEffect } from 'react';
import LuigiClient from '@kyma-project/luigi-client';

export const MicrofrontendContext = createContext({});

export function MicrofrontendContextProvider({ children }) {
  const [context, setContext] = useState({});

  const setContextAndLog = tag => ctx => {
    // console.log(tag, ctx);
    setContext(ctx);
  };

  useEffect(() => {
    const initHandle = LuigiClient.addInitListener(setContextAndLog('init'));
    const updateHandle = LuigiClient.addContextUpdateListener(
      setContextAndLog('update'),
    );

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
