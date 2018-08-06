/* eslint-disable arrow-body-style  */
import fetch from 'isomorphic-fetch';
import { ApolloClient, HttpLink, InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-client-preset';
import { setContext } from 'apollo-link-context';
import { REACT_APP_PUBLIC_API, REACT_APP_PUBLIC_API_KEY, REACT_APP_DEPLOY_ENV } from '../constants/common';
import introspectionQueryResultData from '../constants/graphQLFragmentTypes.json';

global.fetch = fetch;

const uri = `${REACT_APP_PUBLIC_API}/graphql`;

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-api-key': REACT_APP_PUBLIC_API_KEY,
    },
  };
});

// For unions and interfaces
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

export const GqlClient = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri })),
  cache: new InMemoryCache({ fragmentMatcher }),
  connectToDevTools: REACT_APP_DEPLOY_ENV === 'localhost',
});
