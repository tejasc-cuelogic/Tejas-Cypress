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

export const getXmlDetails = gql`
  query fetchFilingSubmission($filingId: ID!, $xmlSubmissionId: ID!) {
    businessFilingSubmission(filingId:$filingId, xmlSubmissionId:$xmlSubmissionId) {
      payload
      businessId
      filingId
      xmlSubmissionId
  } 
}`;

export const filerInformationMutation = gql`
  mutation upsertFilerInformation($filingId: String!, $xmlSubmissionId: String, $businessId: String!, $filerInformation: CreateFilerInformationInput ) {
    upsertFilerInformation(filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, businessId: $businessId, filerInformation: $filerInformation) {
      xmlSubmissionId
      payload
    }
  }`;
