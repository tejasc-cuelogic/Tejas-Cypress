/* eslint-disable arrow-body-style  */
import fetch from 'isomorphic-fetch';
import ApolloClient from 'apollo-boost';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { get } from 'lodash';
import { REACT_APP_PUBLIC_API, REACT_APP_PUBLIC_API_KEY, REACT_APP_DEPLOY_ENV } from '../constants/common';
import introspectionQueryResultData from '../constants/graphQLFragmentTypes.json';
import { authActions } from '../services/actions';
import Helper from '../helper/utility';

global.fetch = fetch;

const uri = `${REACT_APP_PUBLIC_API}/graphql`;

// For unions and interfaces
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

export const GqlClient = new ApolloClient({
  uri,
  request: async (operation) => {
    operation.setContext({
      headers: {
        'x-api-key': REACT_APP_PUBLIC_API_KEY,
      },
    });
  },
  onError: (res) => {
    if (get(res, 'graphQLErrors')) {
      if (['production', 'prod', 'master', 'demo'].includes(REACT_APP_DEPLOY_ENV)) {
        Helper.sendErrorMail(res);
      }
    }
  },
  cache: new InMemoryCache({ fragmentMatcher }),
  // connectToDevTools: REACT_APP_DEPLOY_ENV === 'localhost',
});
