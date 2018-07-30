/* eslint-disable arrow-body-style  */
import fetch from 'isomorphic-fetch';
import { ApolloClient, HttpLink, InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-client-preset';
import { setContext } from 'apollo-link-context';
import { commonStore } from '../services/stores';
import { API_ROOT, USE_DEV_TOOLS } from '../constants/common';
import { GRAPHQL } from '../constants/business';
import introspectionQueryResultData from '../constants/graphQLFragmentTypes.json';

global.fetch = fetch;

const uri = `${API_ROOT}${GRAPHQL}`;

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: commonStore.token ? `Bearer ${commonStore.token}` : '',
    },
  };
});

// For unions and interfaces
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

// const defaultOptions = {
//   watchQuery: {
//     fetchPolicy: 'network-only',
//     errorPolicy: 'ignore',
//   },
//   query: {
//     fetchPolicy: 'network-only',
//     errorPolicy: 'all',
//   },
// };

export const GqlClient = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri })),
  cache: new InMemoryCache({ fragmentMatcher }),
  connectToDevTools: USE_DEV_TOOLS,
  // defaultOptions,
});
