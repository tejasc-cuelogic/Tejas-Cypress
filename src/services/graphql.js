/* eslint-disable arrow-body-style */
import fetch from 'isomorphic-fetch';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import commonStore from './../stores/commonStore';
import { API_ROOT } from '../constants/common';
import { GRAPHQL } from '../constants/business';

global.fetch = fetch;

// const uri = 'https://api.graph.cool/simple/v1/cjei7bof31u8101243cyfqgjw';
const uri = `${API_ROOT}${GRAPHQL}`;
const wsUri = 'wss://subscriptions.us-west-2.graph.cool/v1/cjei7bof31u8101243cyfqgjw';

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: commonStore.token ? `Bearer ${commonStore.token}` : '',
    },
  };
});

export const GqlClient = new ApolloClient({
  // link: new HttpLink({ uri }),
  link: split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    new WebSocketLink({ uri: wsUri, options: { reconnect: true } }),
    authLink.concat(new HttpLink({ uri })),
  ),
  cache: new InMemoryCache(),
});
