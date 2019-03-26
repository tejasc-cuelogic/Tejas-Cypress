/* eslint-disable arrow-body-style  */
import fetch from 'isomorphic-fetch';
import { ApolloClient, HttpLink, InMemoryCache, IntrospectionFragmentMatcher, ApolloLink } from 'apollo-client-preset';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { commonStore, authStore } from '../services/stores';
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
      authorization: commonStore.token ? `Bearer ${commonStore.token}` : '',
    },
  };
});

const errorLink = onError((res) => {
  console.log(res);
  if (res.networkError === 'The incoming token has expired') {
    authActions.logout().then(() => {
      this.props.history.push('/auth/login');
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
