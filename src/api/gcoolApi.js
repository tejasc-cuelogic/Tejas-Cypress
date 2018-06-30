/* eslint-disable arrow-body-style  */
import fetch from 'isomorphic-fetch';
import { ApolloClient, HttpLink, InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-client-preset';
import { setContext } from 'apollo-link-context';
import { commonStore } from '../services/stores';
import introspectionQueryResultData from '../constants/graphQLFragmentTypes.json';

global.fetch = fetch;

const uri = 'https://api.graph.cool/simple/v1/cjei7bof31u8101243cyfqgjw';
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: commonStore.token ? `Bearer ${commonStore.token}` : '',
    },
  };
});

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

export const GqlClient = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri })),
  cache: new InMemoryCache({ fragmentMatcher }),
});
