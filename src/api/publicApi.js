/* eslint-disable arrow-body-style  */
import fetch from 'isomorphic-fetch';
import ApolloClient from 'apollo-boost';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { REACT_APP_PUBLIC_API, REACT_APP_PUBLIC_API_KEY } from '../constants/common';
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
  cache: new InMemoryCache({ fragmentMatcher }),
  // connectToDevTools: REACT_APP_DEPLOY_ENV === 'localhost',
});
