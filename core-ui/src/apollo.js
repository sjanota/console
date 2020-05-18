import { ApolloClient } from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { split } from 'apollo-link';
import { getApiUrl as getURL } from '@kyma-project/common';

import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import React, { useEffect, useState } from 'react';
import { ApolloProvider } from 'react-apollo';
import { useMicrofrontendContext, isSubscriptionOperation } from 'react-shared';

const errorLink = onError(
  ({ operation, response, graphQLErrors, networkError }) => {
    if (process.env.REACT_APP_ENV !== 'production') {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      }

      if (networkError) console.log(`[Network error]: ${networkError}`);
    }
  },
);

export function createCompassApolloClient(token) {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: {
        types: [],
      },
    },
  });

  const graphqlApiUrl = getURL('compassApiUrl');
  const tenant = getURL('compassDefaultTenant');

  const httpLink = createHttpLink({
    uri: graphqlApiUrl,
  });

  const authLink = modifyHeaders([
    setAuthorizationHeader(token),
    setTenantHeader(tenant),
  ]);
  const authHttpLink = authLink.concat(httpLink);

  return new ApolloClient({
    uri: graphqlApiUrl,
    link: ApolloLink.from([errorLink, authHttpLink]),
    cache: new InMemoryCache({
      fragmentMatcher,
      dataIdFromObject: object => object.name || null,
    }),
  });
}

export function createKymaApolloClient(token) {
  if (!token) {
    return null;
  }

  const graphqlApiUrl = getURL(
    process.env.REACT_APP_LOCAL_API ? 'graphqlApiUrlLocal' : 'graphqlApiUrl',
  );

  const httpLink = createHttpLink({
    uri: graphqlApiUrl,
  });

  const authLink = modifyHeaders([setAuthorizationHeader(token)]);
  const authHttpLink = authLink.concat(httpLink);

  const wsLink = new WebSocketLink({
    token,
    uri: getURL('subscriptionsApiUrl'),
    options: {
      reconnect: true,
    },
  });

  const link = split(isSubscriptionOperation, wsLink, authHttpLink);

  return new ApolloClient({
    uri: graphqlApiUrl,
    link: ApolloLink.from([errorLink, link]),
    cache: new InMemoryCache({
      dataIdFromObject: object => object.name || null,
    }),
  });
}

const modifyHeaders = ops =>
  setContext((_, { oldHeaders }) => ({
    headers: ops.reduce((acc, op) => op(acc), oldHeaders),
  }));

const setHeader = (header, value) => headers => ({
  ...headers,
  [header]: value,
});

const setAuthorizationHeader = token =>
  setHeader('authorization', `bearer ${token}`);

const setTenantHeader = tenant => setHeader('tenant', tenant ? tenant : null);

export const ApolloClientProvider = ({ children, createClient, provider }) => {
  const context = useMicrofrontendContext();
  const [client, setClient] = useState(null);

  useEffect(() => {
    const client = createClient(context.idToken);
    setClient(client);
    return () => {
      try {
        client && client.stop();
      } finally {
      }
    };
  }, [context.idToken, createClient, setClient]);

  const Provider = provider ? provider : ApolloProvider;
  return client && <Provider client={client}>{children}</Provider>;
};

class WebSocketLink extends ApolloLink {
  constructor(paramsOrClient) {
    super();

    if (paramsOrClient instanceof SubscriptionClient) {
      this.subscriptionClient = paramsOrClient;
    } else {
      this.subscriptionClient = new SubscriptionClient(
        paramsOrClient.uri,
        paramsOrClient.options,
        null,
        ['graphql-ws', paramsOrClient.token],
      );
    }
  }

  request(operation) {
    return this.subscriptionClient.request(operation);
  }
}
