import gql from 'graphql-tag';

export const userDeleteIndices = gql`
  mutation userDeleteIndices($index: ENUM) {
    userDeleteIndices(index: $index)
  }`;

export const userPopulateIndex = gql`
  mutation userPopulateIndex($index: ENUM) {
    userPopulateIndex(index: $index)
  }`;

export const crowdPayDeleteIndices = gql`
  mutation crowdPayDeleteIndices($index: ENUM) {
    crowdPayDeleteIndices(index: $index)
  }`;

export const crowdPayPopulateIndex = gql`
  mutation crowdPayPopulateIndex($index: ENUM) {
    crowdPayPopulateIndex(index: $index)
  }`;

export const linkedBankDeleteIndices = gql`
  mutation linkedBankDeleteIndices($index: ENUM) {
    linkedBankDeleteIndices(index: $index)
  }`;

export const linkedBankPopulateIndex = gql`
  mutation linkedBankPopulateIndex($index: ENUM) {
    linkedBankPopulateIndex(index: $index)
  }`;

export const accreditationDeleteIndices = gql`
  mutation accreditationDeleteIndices($index: ENUM) {
    accreditationDeleteIndices(index: $index)
  }`;

export const accreditationPopulateIndex = gql`
  mutation accreditationPopulateIndex($index: ENUM) {
    accreditationPopulateIndex(index: $index)
  }`;

export const offeringsDeleteIndices = gql`
  mutation offeringDeleteIndices($index: ENUM) {
    offeringDeleteIndices(index: $index)
  }`;

export const offeringsPopulateIndex = gql`
  mutation offeringPopulateIndices($index: ENUM) {
    offeringPopulateIndices(index: $index)
  }`;

export const getESAudit = gql`
query getESAudit($indexAliasName: ENUM, $documentId: String) {
  offeringPopulateIndices(indexAliasName: $indexAliasName, documentId: $documentId)
}`;

export const swapIndexAliases = gql`
mutation swapIndexAliases($indexAliasName: ENUM!) {
  offeringPopulateIndices(indexAliasName: $indexAliasName)
}`;
