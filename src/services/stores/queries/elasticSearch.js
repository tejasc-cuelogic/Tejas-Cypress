import gql from 'graphql-tag';

export const userDeleteIndices = gql`
  mutation userDeleteIndices($index: userESIndexEnum!) {
    userDeleteIndices(index: $index)
  }`;

export const userPopulateIndex = gql`
  mutation userPopulateIndex($index: userESIndexEnum!) {
    userPopulateIndex(index: $index)
  }`;

export const crowdPayDeleteIndices = gql`
  mutation crowdPayDeleteIndices($index: CrowdpayESIndexEnum!) {
    crowdPayDeleteIndices(index: $index)
  }`;

export const crowdPayPopulateIndex = gql`
  mutation crowdPayPopulateIndex($index: CrowdpayESIndexEnum!) {
    crowdPayPopulateIndex(index: $index)
  }`;

export const linkedBankDeleteIndices = gql`
  mutation linkedBankDeleteIndices($index: LinkedbankESIndexEnum!) {
    linkedBankDeleteIndices(index: $index)
  }`;

export const linkedBankPopulateIndex = gql`
  mutation linkedBankPopulateIndex($index: LinkedbankESIndexEnum!) {
    linkedBankPopulateIndex(index: $index)
  }`;

export const accreditationDeleteIndices = gql`
  mutation accreditationDeleteIndices($index: AccreditationESIndexEnum!) {
    accreditationDeleteIndices(index: $index)
  }`;

export const accreditationPopulateIndex = gql`
  mutation accreditationPopulateIndex($index: AccreditationESIndexEnum!) {
    accreditationPopulateIndex(index: $index)
  }`;

export const offeringsDeleteIndices = gql`
  mutation offeringDeleteIndices($index: OfferingESIndexEnum!) {
    offeringDeleteIndices(index: $index)
  }`;

export const offeringsPopulateIndex = gql`
  mutation offeringPopulateIndices($index: OfferingESIndexEnum!) {
    offeringPopulateIndices(index: $index)
  }`;

export const getESAudit = gql`
query getESAudit($indexAliasName: ESIndexAliasEnum, $random: String) {
  getESAudit(indexAliasName: $indexAliasName, random: $random)
  {
    indices {
      alias
      active
      index_a {
        indexName
        record
        count
        created {
          id
          by
          date
        }
      }
      index_b {
        indexName
        record
        count
        created {
          id
          by
          date
        }
      }
    }
  }
}`;

export const swapIndexAliases = gql`
mutation swapIndexAliases($indexAliasName: ENUM!) {
  offeringPopulateIndices(indexAliasName: $indexAliasName)
}`;
