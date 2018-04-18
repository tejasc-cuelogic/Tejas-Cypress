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

export const issuerInformationMutation = gql`
  mutation upsertIssuerInformation($filingId: String!, $xmlSubmissionId: String!, $issuerInformation: CreateIssuerInformationInput ) {
    upsertIssuerInformation(filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, issuerInformation: $issuerInformation) {
      xmlSubmissionId
      payload
    }
  }`;

export const offeringInformationMutation = gql`
  mutation upsertOfferingInformation($filingId: String!, $xmlSubmissionId: String!, $offeringInformation: CreateOfferingInformationInput ) {
    upsertOfferingInformation(filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, offeringInformation: $offeringInformation) {
      xmlSubmissionId
      payload
    }
  }`;

export const annualReportMutation = gql`
  mutation upsertAnnualReportDisclosureRequirements($filingId: String!, $xmlSubmissionId: String!, $annualReportDisclosureRequirements: CreateAnnualReportDisclosureRequirementsInput ) {
    upsertAnnualReportDisclosureRequirements(filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, annualReportDisclosureRequirements: $annualReportDisclosureRequirements) {
      xmlSubmissionId
      payload
    }
  }`;
