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
  mutation upsertXmlInformation($businessId: String!, $filingId: String!, $xmlSubmissionId: String, $filerInformation: CreateFilerInformationInput ) {
    upsertXmlInformation(businessId: $businessId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, filerInformation: $filerInformation) {
      xmlSubmissionId
      payload
    }
  }`;

export const issuerInformationMutation = gql`
  mutation upsertXmlInformation($businessId: String!, $filingId: String!, $xmlSubmissionId: String, $issuerInformation: CreateIssuerInformationInput ) {
    upsertXmlInformation(businessId: $businessId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, issuerInformation: $issuerInformation) {
      xmlSubmissionId
      payload
    }
  }`;

export const offeringInformationMutation = gql`
  mutation upsertXmlInformation($businessId: String!, $filingId: String!, $xmlSubmissionId: String, $offeringInformation: CreateOfferingInformationInput ) {
    upsertXmlInformation(businessId: $businessId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, offeringInformation: $offeringInformation) {
      xmlSubmissionId
      payload
    }
  }`;

export const annualReportMutation = gql`
  mutation upsertXmlInformation($businessId: String!, $filingId: String!, $xmlSubmissionId: String, $annualReportDisclosureRequirements: CreateAnnualReportDisclosureRequirementsInput ) {
    upsertXmlInformation(businessId: $businessId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, annualReportDisclosureRequirements: $annualReportDisclosureRequirements) {
      xmlSubmissionId
      payload
    }
  }`;

export const signatureMutation = gql`
mutation upsertXmlInformation($businessId: String!, $filingId: String!, $xmlSubmissionId: String, $signature: CreateSignatureInput ) {
  upsertXmlInformation(businessId: $businessId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, signature: $signature) {
    xmlSubmissionId
    payload
  }
}`;

export const documentListMutation = gql`
  mutation upsertXmlInformation($businessId: String!, $filingId: String!, $xmlSubmissionId: String, $documentList: [CreateDocumentInput] ) {
    upsertXmlInformation(businessId: $businessId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, documentList: $documentList) {
      xmlSubmissionId
      payload
    }
  }`;

export const xmlSubmissionMutation = gql`
  mutation upsertXmlInformation($businessId: String!, $filingId: String!, $xmlSubmissionId: String) {
    upsertXmlInformation(businessId: $businessId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId) {
      xmlSubmissionId
      xmlSubmissionStatus
    }
  }`;
