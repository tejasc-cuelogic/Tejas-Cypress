/* eslint-disable arrow-body-style  */
import fetch from 'isomorphic-fetch';
import { ApolloClient, HttpLink, InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-client-preset';
import { setContext } from 'apollo-link-context';
import commonStore from '../services/stores';
// import { API_ROOT } from '../constants/common';
// import { GRAPHQL } from '../constants/business';
import introspectionQueryResultData from '../constants/graphQLFragmentTypes.json';

global.fetch = fetch;

// const uri = `${API_ROOT}${GRAPHQL}`;
const uri = 'https://api.graph.cool/simple/v1/cjei7bof31u8101243cyfqgjw';

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

export const GqlClient = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri })),
  cache: new InMemoryCache({ fragmentMatcher }),
});
