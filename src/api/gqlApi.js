/* eslint-disable arrow-body-style  */
import fetch from 'isomorphic-fetch';
import { ApolloClient, HttpLink, InMemoryCache, IntrospectionFragmentMatcher, ApolloLink } from 'apollo-client-preset';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { get } from 'lodash';
import { authStore } from '../services/stores';
import { API_ROOT, REACT_APP_DEPLOY_ENV } from '../constants/common';
import { GRAPHQL } from '../constants/business';
import introspectionQueryResultData from '../constants/graphQLFragmentTypes.json';
import { authActions } from '../services/actions';

global.fetch = fetch;

const uri = `${API_ROOT}${GRAPHQL}`;
const httpLink = new HttpLink({ uri });

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: window.localStorage.getItem('jwt') ? `Bearer ${window.localStorage.getItem('jwt')}` : '',
    },
  };
});

const errorLink = onError((res) => {
  if (get(res, 'networkError.statusCode') === 401 || get(res, 'networkError.result.message') === 'The incoming token has expired') {
    console.log(res);
    authActions.logout().then(() => {
      window.location = '/auth/login';
    });
  }
});

const link = ApolloLink.from([
  errorLink,
  authLink,
  httpLink,
]);

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

authStore.resetIdelTimer();

export const GqlClient = new ApolloClient({
  // link: authLink.concat(new HttpLink({ uri })),
  link,
  cache: new InMemoryCache({ fragmentMatcher }),
  connectToDevTools: REACT_APP_DEPLOY_ENV === 'localhost',
  // defaultOptions,
});
