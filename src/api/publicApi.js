/* eslint-disable arrow-body-style  */
import fetch from 'isomorphic-fetch';
import ApolloClient from 'apollo-boost';
import { get } from 'lodash';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { authStore } from '../services/stores';
import { REACT_APP_PUBLIC_API, REACT_APP_PUBLIC_API_KEY, REACT_APP_DEPLOY_ENV } from '../constants/common';
import introspectionQueryResultData from '../constants/graphQLFragmentTypes.json';

global.fetch = fetch;

const uri = `${REACT_APP_PUBLIC_API}/graphql`;

// For unions and interfaces
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

export const GqlClient = new ApolloClient({
  uri,
  request: async (operation) => {
    operation.setContext({
      headers: {
        'x-api-key': REACT_APP_PUBLIC_API_KEY,
      },
    });
  },
  onError: (res) => {
    if (['production', 'prod', 'master', 'demo'].includes(REACT_APP_DEPLOY_ENV) && get(res, 'graphQLErrors[0]')) {
      authStore.sendErrorMail(res);
    }
  },
  cache: new InMemoryCache({ fragmentMatcher }),
  // connectToDevTools: REACT_APP_DEPLOY_ENV === 'localhost',
});
