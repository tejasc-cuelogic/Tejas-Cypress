/* eslint-disable arrow-body-style  */
import fetch from 'isomorphic-fetch';
import ApolloClient from 'apollo-boost';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import Auth from '@aws-amplify/auth';
import { get } from 'lodash';
import { authStore } from '../services/stores';
import { API_ROOT, REACT_APP_DEPLOY_ENV } from '../constants/common';
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
    const session = await Auth.currentSession();
    const jwtToken = get(session, 'idToken.jwtToken');
    operation.setContext({
      headers: {
        authorization: jwtToken ? `Bearer ${jwtToken}` : '',
      },
    });
  },
  onError: (res) => {
    if (['production', 'prod', 'master', 'demo'].includes(REACT_APP_DEPLOY_ENV)) {
      authStore.sendErrorMail(res);
    }
    if (get(res, 'networkError.statusCode') === 401 || get(res, 'networkError.result.message') === 'The incoming token has expired') {
      console.log(res);
      authActions.logout('timeout').then(() => {
        window.location = '/login';
      });
    }
  },
  cache: new InMemoryCache({ fragmentMatcher }),
  // connectToDevTools: REACT_APP_DEPLOY_ENV === 'localhost',
  // defaultOptions,
});
