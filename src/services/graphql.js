// import fetch from 'isomorphic-fetch';
import request from 'superagent';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { API_ROOT } from '../constants/common';
import { GRAPHQL } from '../constants/business';

global.request = request;

const uri = `${API_ROOT}${GRAPHQL}`;
const wsUri = 'wss://subscriptions.us-west-2.graph.cool/v1/cjei7bof31u8101243cyfqgjw';

export const GqlClient = new ApolloClient({
  link: split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    new WebSocketLink({ uri: wsUri, options: { reconnect: true } }),
    new HttpLink({ uri }),
  ),
  cache: new InMemoryCache(),
});
