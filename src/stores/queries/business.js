import gql from 'graphql-tag';

export const listOfferings = gql`
  query getOfferingFilings {
    offeringFilings {
      id created payload { 
        templateVariables { 
          name_of_business
        } 
      }
    } 
  }`;
