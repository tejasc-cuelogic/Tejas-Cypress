/* eslint-disable arrow-body-style */
import fetch from 'isomorphic-fetch';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset';
import { setContext } from 'apollo-link-context';
import commonStore from './../stores/commonStore';
import { API_ROOT } from '../constants/common';
import { GRAPHQL } from '../constants/business';

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

export const GqlClient = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri })),
  cache: new InMemoryCache(),
});
