/* eslint-disable arrow-body-style  */
import fetch from 'isomorphic-fetch';
import ApolloClient from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { RetryLink } from 'apollo-link-retry';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import Auth from '@aws-amplify/auth';
import { get } from 'lodash';
import { authStore } from '../services/stores';
import { API_ROOT, REACT_APP_DEPLOY_ENV, RETRY_CONFIG } from '../constants/common';
import { GRAPHQL } from '../constants/business';
import introspectionQueryResultData from '../constants/graphQLFragmentTypes.json';
import { authActions } from '../services/actions';

global.fetch = fetch;

const uri = `${API_ROOT}${GRAPHQL}`;

// For unions and interfaces
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

authStore.resetIdelTimer();

const httpLink = new HttpLink({
  uri,
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const session = await Auth.currentSession();
  console.log('token', session);
  const jwtToken = get(session, 'idToken.jwtToken');
  return {
    headers: {
      ...headers,
      authorization: jwtToken ? `Bearer ${jwtToken}` : '',
    },
  };
});

export const GqlClient = new ApolloClient({
  link: ApolloLink.from([
    new RetryLink(RETRY_CONFIG),
    authLink,
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
      if (get(res, 'networkError.statusCode') === 401 || get(res, 'networkError.result.message') === 'The incoming token has expired') {
        console.log(res);
        authActions.logout('timeout').then(() => {
          window.location = '/login';
        });
      }
    }),
    httpLink,
  ]),
  cache: new InMemoryCache({ fragmentMatcher }),
  // connectToDevTools: REACT_APP_DEPLOY_ENV === 'localhost',
  // defaultOptions,
});
