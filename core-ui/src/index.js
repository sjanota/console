import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import { preloadingStrategy } from '@kyma-project/common';
import './index.scss';
import App from './components/App/App';
import { Application } from 'react-shared';

import {
  ApolloClientProvider,
  createKymaApolloClient,
  createCompassApolloClient,
} from './apollo';

export const CompassGqlContext = React.createContext(null);

preloadingStrategy(async () => {
  ReactDOM.render(
    <Application>
      <ApolloClientProvider createClient={createKymaApolloClient}>
        <ApolloClientProvider
          createClient={createCompassApolloClient}
          provider={CompassGqlContext.Provider}
        >
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ApolloClientProvider>
      </ApolloClientProvider>
    </Application>,
    document.getElementById('root'),
  );
});
