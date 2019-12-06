/* eslint-disable */
import fetch from 'isomorphic-fetch';
import ApolloClient from 'apollo-client';
import { get } from 'lodash';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { RetryLink } from 'apollo-link-retry';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { authStore } from '../services/stores';
import { REACT_APP_PUBLIC_API, REACT_APP_PUBLIC_API_KEY, REACT_APP_DEPLOY_ENV, RETRY_CONFIG } from '../constants/common';

global.fetch = fetch;

const uri = `${REACT_APP_PUBLIC_API}/graphql`;

export const GqlClient = new ApolloClient({
  link: ApolloLink.from([
    new RetryLink(RETRY_CONFIG),
    onError((res) => {
      // if (graphQLErrors) {
      //   graphQLErrors.forEach(({ message, locations, path }) =>
      //     console.log(
      //       `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      //     ),
      //   );
      // }
      // if (networkError) console.log(`[Network error]: ${networkError}`);
      if (['production', 'prod', 'master', 'demo'].includes(REACT_APP_DEPLOY_ENV) && get(res, 'graphQLErrors[0]')) {
        authStore.sendErrorMail(res);
      }
    }),
    new HttpLink({
      uri,
      headers: {
        'x-api-key': REACT_APP_PUBLIC_API_KEY
      },
    }),
  ]),
  cache: new InMemoryCache()
});
