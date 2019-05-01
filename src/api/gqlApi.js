/* eslint-disable arrow-body-style  */
import fetch from 'isomorphic-fetch';
import ApolloClient from 'apollo-boost';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { get } from 'lodash';
import { authStore } from '../services/stores';
import { API_ROOT } from '../constants/common';
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

export const GqlClient = new ApolloClient({
  uri,
  request: async (operation) => {
    operation.setContext({
      headers: {
        authorization: window.localStorage.getItem('jwt') ? `Bearer ${window.localStorage.getItem('jwt')}` : '',
      },
    });
  },
  onError: (res) => {
    if (get(res, 'networkError.statusCode') === 401 || get(res, 'networkError.result.message') === 'The incoming token has expired') {
      console.log(res);
      authActions.logout('timeout').then(() => {
        window.location = '/auth/login';
      });
    }
  },
  cache: new InMemoryCache({ fragmentMatcher }),
  // connectToDevTools: REACT_APP_DEPLOY_ENV === 'localhost',
  // defaultOptions,
});
