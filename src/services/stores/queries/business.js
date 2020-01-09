import gql from 'graphql-tag';


export const adminBusinessFilingSubmission = gql`
  query adminBusinessFilingSubmission($filingId: ID!, $xmlSubmissionId: ID!) {
    adminBusinessFilingSubmission(filingId:$filingId, xmlSubmissionId:$xmlSubmissionId) {
      payload
      offeringId
      filingId
      xmlSubmissionId
      xmlSubmissionStatus
  }
}`;

export const filerInformationMutation = gql`
  mutation adminUpsertXmlInformation($offeringId: String!, $filingId: String!, $xmlSubmissionId: String, $filerInformation: CreateFilerInformationInput ) {
    adminUpsertXmlInformation(offeringId: $offeringId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, filerInformation: $filerInformation) {
      ... on BusinessFilingSubmission {
        payload
        xmlSubmissionId
      }
    }
  }`;

export const issuerInformationMutation = gql`
  mutation adminUpsertXmlInformation($offeringId: String!, $filingId: String!, $xmlSubmissionId: String, $issuerInformation: CreateIssuerInformationInput ) {
    adminUpsertXmlInformation(offeringId: $offeringId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, issuerInformation: $issuerInformation) {
      ... on BusinessFilingSubmission {
        payload
        xmlSubmissionId
      }
    }
  }`;

export const offeringInformationMutation = gql`
  mutation adminUpsertXmlInformation($offeringId: String!, $filingId: String!, $xmlSubmissionId: String, $offeringInformation: CreateOfferingInformationInput ) {
    adminUpsertXmlInformation(offeringId: $offeringId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, offeringInformation: $offeringInformation) {
      ... on BusinessFilingSubmission {
        payload
        xmlSubmissionId
      }
    }
  }`;

export const annualReportMutation = gql`
  mutation adminUpsertXmlInformation($offeringId: String!, $filingId: String!, $xmlSubmissionId: String, $annualReportDisclosureRequirements: CreateAnnualReportDisclosureRequirementsInput ) {
    adminUpsertXmlInformation(offeringId: $offeringId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, annualReportDisclosureRequirements: $annualReportDisclosureRequirements) {
      ... on BusinessFilingSubmission {
        payload
        xmlSubmissionId
      }
    }
  }`;

export const signatureMutation = gql`
mutation adminUpsertXmlInformation($offeringId: String!, $filingId: String!, $xmlSubmissionId: String, $signature: CreateSignatureInput ) {
  adminUpsertXmlInformation(offeringId: $offeringId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, signature: $signature) {
    ... on BusinessFilingSubmission {
      payload
      xmlSubmissionId
    }
  }
}`;

export const documentListMutation = gql`
  mutation adminUpsertXmlInformation($offeringId: String!, $filingId: String!, $xmlSubmissionId: String, $documentList: [CreateDocumentInput] ) {
    adminUpsertXmlInformation(offeringId: $offeringId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId, documentList: $documentList) {
      ... on BusinessFilingSubmission {
        payload
        xmlSubmissionId
      }
    }
  }`;

export const xmlSubmissionMutation = gql`
  mutation adminUpsertXmlInformation($offeringId: String!, $filingId: String!, $xmlSubmissionId: String) {
    adminUpsertXmlInformation(offeringId: $offeringId, filingId:$filingId, xmlSubmissionId: $xmlSubmissionId) {
      ... on BusinessFilingSubmission {
        xmlSubmissionId
      }
      ... on XmlSubmissionErrorOutput {
        errors
      }
    }
  }`;


export const adminCloneXmlSubmission = gql`
  mutation adminCloneXmlSubmission($filingId: String!, $xmlSubmissionId: String!) {
    adminCloneXmlSubmission(filingId:$filingId, xmlSubmissionId: $xmlSubmissionId) {
      xmlSubmissionId
    }
  }`;

  export const adminDeleteBusinessFilingSubmission = gql`
  mutation adminDeleteBusinessFilingSubmission($filingId: String!, $xmlSubmissionId: String!) {
    adminDeleteBusinessFilingSubmission(filingId: $filingId, xmlSubmissionId: $xmlSubmissionId) {
      xmlSubmissionId
    }
  }`;
