import fetch from 'isomorphic-fetch';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import { WebSocketLink } from 'apollo-link-ws';

global.fetch = fetch;

const uri = 'https://api.graph.cool/simple/v1/cjei7bof31u8101243cyfqgjw';
const wsUri = 'wss://subscriptions.us-west-2.graph.cool/v1/cjei7bof31u8101243cyfqgjw';

const wsClient = new SubscriptionClient('wss://subscriptions.us-west-2.graph.cool/v1/cjei7bof31u8101243cyfqgjw', {
  reconnect: true
})

export const GqlClient = new ApolloClient({
  link: split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    // wsClient,
    new HttpLink({ uri })
  ),
  cache: new InMemoryCache()
});