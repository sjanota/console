import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createApolloClient } from './store';
import { useMicrofrontendContext } from 'react-shared';

export const ApolloClientProvider = ({ children }) => {
  const { tenantId, idToken } = useMicrofrontendContext();

  if (!idToken) {
    return <p>Loading...</p>;
  }

  const client = createApolloClient(tenantId, idToken);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
