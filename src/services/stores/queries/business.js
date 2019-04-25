import gql from 'graphql-tag';


export const getXmlDetails = gql`
  query fetchFilingSubmission($filingId: ID!, $xmlSubmissionId: ID!) {
    businessFilingSubmission(filingId:$filingId, xmlSubmissionId:$xmlSubmissionId) {
      payload
      offeringId
      filingId
      xmlSubmissionId
      xmlSubmissionStatus
  }
}`;

export const filerInformationMutation = gql`
  mutation upsertXmlInformation($offeringId: String!, $filingId: String!, $xmlSubmissionId: String, $filerInformation: CreateFilerInformationInput ) {
    upsertXmlInformation(offeringId: $offeringId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, filerInformation: $filerInformation) {
      ... on BusinessFilingSubmission {
        payload
        xmlSubmissionId
      }
    }
  }`;

export const issuerInformationMutation = gql`
  mutation upsertXmlInformation($offeringId: String!, $filingId: String!, $xmlSubmissionId: String, $issuerInformation: CreateIssuerInformationInput ) {
    upsertXmlInformation(offeringId: $offeringId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, issuerInformation: $issuerInformation) {
      ... on BusinessFilingSubmission {
        payload
        xmlSubmissionId
      }
    }
  }`;

export const offeringInformationMutation = gql`
  mutation upsertXmlInformation($offeringId: String!, $filingId: String!, $xmlSubmissionId: String, $offeringInformation: CreateOfferingInformationInput ) {
    upsertXmlInformation(offeringId: $offeringId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, offeringInformation: $offeringInformation) {
      ... on BusinessFilingSubmission {
        payload
        xmlSubmissionId
      }
    }
  }`;

export const annualReportMutation = gql`
  mutation upsertXmlInformation($offeringId: String!, $filingId: String!, $xmlSubmissionId: String, $annualReportDisclosureRequirements: CreateAnnualReportDisclosureRequirementsInput ) {
    upsertXmlInformation(offeringId: $offeringId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, annualReportDisclosureRequirements: $annualReportDisclosureRequirements) {
      ... on BusinessFilingSubmission {
        payload
        xmlSubmissionId
      }
    }
  }`;

export const signatureMutation = gql`
mutation upsertXmlInformation($offeringId: String!, $filingId: String!, $xmlSubmissionId: String, $signature: CreateSignatureInput ) {
  upsertXmlInformation(offeringId: $offeringId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, signature: $signature) {
    ... on BusinessFilingSubmission {
      payload
      xmlSubmissionId
    }
  }
}`;

export const documentListMutation = gql`
  mutation upsertXmlInformation($offeringId: String!, $filingId: String!, $xmlSubmissionId: String, $documentList: [CreateDocumentInput] ) {
    upsertXmlInformation(offeringId: $offeringId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, documentList: $documentList) {
      ... on BusinessFilingSubmission {
        payload
        xmlSubmissionId
      }
    }
  }`;

export const xmlSubmissionMutation = gql`
  mutation upsertXmlInformation($offeringId: String!, $filingId: String!, $xmlSubmissionId: String) {
    upsertXmlInformation(offeringId: $offeringId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId) {
      ... on BusinessFilingSubmission {
        xmlSubmissionId
      }
      ... on XmlSubmissionErrorOutput {
        errors
      }
    }
  }`;


export const cloneXmlSubmissionMutation = gql`
  mutation cloneXmlSubmission($filingId: String!, $xmlSubmissionId: String!) {
    cloneXmlSubmission(filingId:$filingId, xmlSubmissionId: $xmlSubmissionId) {
      xmlSubmissionId
    }
  }`;
