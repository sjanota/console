import React, { createContext, useContext, useState, useEffect } from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { isEqual } from 'lodash';

export const MicrofrontendContext = createContext({});

const watchedProperties = [
  'tenantId',
  'idToken',
  'backendModules',
  'showSystemNamespaces',
];

const hasPropertyChanged = (context, newContext) => {
  return (
    newContext &&
    watchedProperties.some(
      property => !isEqual(newContext[property], context[property]),
    )
  );
};

const updateContext = newContext => context =>
  hasPropertyChanged(context, newContext) ? newContext : context;

export function MicrofrontendContextProvider({ children }) {
  const [context, setContext] = useState({});

  useEffect(() => {
    const callback = ctx => setContext(updateContext(ctx));

    const initHandle = LuigiClient.addInitListener(callback);
    const updateHandle = LuigiClient.addContextUpdateListener(callback);

    return () => {
      LuigiClient.removeContextUpdateListener(updateHandle);
      LuigiClient.removeInitListener(initHandle);
    };
  }, []);

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
