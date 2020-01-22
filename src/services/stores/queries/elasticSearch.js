import gql from 'graphql-tag';

export const adminDeleteUserIndices = gql`
  mutation adminDeleteUserIndices($index: userESIndexEnum!) {
    adminDeleteUserIndices(index: $index)
  }`;

export const adminPopulateUserIndex = gql`
  mutation adminPopulateUserIndex($index: userESIndexEnum!) {
    adminPopulateUserIndex(index: $index)
  }`;

export const adminDeleteCrowdPayIndices = gql`
  mutation adminDeleteCrowdPayIndices($index: CrowdpayESIndexEnum!) {
    adminDeleteCrowdPayIndices(index: $index)
  }`;

export const adminPopulateCrowdPayIndex = gql`
  mutation adminPopulateCrowdPayIndex($index: CrowdpayESIndexEnum!) {
    adminPopulateCrowdPayIndex(index: $index)
  }`;

export const adminDeleteLinkedBankIndices = gql`
  mutation adminDeleteLinkedBankIndices($index: LinkedbankESIndexEnum!) {
    adminDeleteLinkedBankIndices(index: $index)
  }`;

export const adminPopulateLinkedBankIndex = gql`
  mutation adminPopulateLinkedBankIndex($index: LinkedbankESIndexEnum!) {
    adminPopulateLinkedBankIndex(index: $index)
  }`;

export const adminDeleteAccreditationIndices = gql`
  mutation adminDeleteAccreditationIndices($index: AccreditationESIndexEnum!) {
    adminDeleteAccreditationIndices(index: $index)
  }`;

export const adminPopulateAccreditationIndex = gql`
  mutation adminPopulateAccreditationIndex($index: AccreditationESIndexEnum!) {
    adminPopulateAccreditationIndex(index: $index)
  }`;

export const adminDeleteOfferingIndices = gql`
  mutation adminDeleteOfferingIndices($index: OfferingESIndexEnum!) {
    adminDeleteOfferingIndices(index: $index)
  }`;

export const adminPopulateOfferingIndices = gql`
  mutation adminPopulateOfferingIndices($index: OfferingESIndexEnum!) {
    adminPopulateOfferingIndices(index: $index)
  }`;

export const getESAuditList = gql`
query adminGetESAudit($indexAliasName: ESIndexAliasEnum, $random: String) {
  adminGetESAudit(indexAliasName: $indexAliasName, random: $random)
  {
    indices {
      alias
      active
      index_a {
        indexName
        created {
          date
        }
      }
      index_b {
        indexName
        created {
          date
        }
      }
    }
  }
}`;

export const adminGetESAudit = gql`
query adminGetESAudit($indexAliasName: ESIndexAliasEnum, $random: String) {
  adminGetESAudit(indexAliasName: $indexAliasName, random: $random)
  {
    indices {
      alias
      active
      index_a {
        indexName
        record
        count
        created {
          date
        }
      }
      index_b {
        indexName
        record
        count
        created {
          date
        }
      }
    }
  }
}`;

export const adminSwapIndexOnAlias = gql`
mutation adminSwapIndexOnAlias($indexAliasName: ESIndexAliasEnum!) {
  adminSwapIndexOnAlias(indexAliasName: $indexAliasName){
    message
    success
  }
}`;
