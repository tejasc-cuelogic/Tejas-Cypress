/* eslint-disable arrow-body-style  */
import fetch from 'isomorphic-fetch';
import ApolloClient from 'apollo-boost';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import introspectionQueryResultData from '../constants/graphQLFragmentTypes.json';

global.fetch = fetch;

const uri = 'https://api.graph.cool/simple/v1/cjei7bof31u8101243cyfqgjw';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

export const GqlClient = new ApolloClient({
  uri,
  request: async (operation) => {
    operation.setContext({
      headers: {
        authorization: window.localStorage.getItem('jwt') ? `Bearer ${window.localStorage.getItem('jwt')}` : '',
      },
    });
  },
  cache: new InMemoryCache({ fragmentMatcher }),
});
