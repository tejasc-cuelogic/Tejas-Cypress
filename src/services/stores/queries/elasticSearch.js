import gql from 'graphql-tag';

export const adminDeleteIndex = gql`
  mutation adminDeleteIndex($index: EsIndexEnum!, $indexAliasName: ESIndexAliasEnum!) {
    adminDeleteIndex(index: $index, indexAliasName: $indexAliasName)
  }
`;

export const adminPopulateIndex = gql`
  mutation adminPopulateIndex($index: EsIndexEnum!, $indexAliasName: ESIndexAliasEnum!) {
    adminPopulateIndex(index: $index, indexAliasName: $indexAliasName) 
  }
`;

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
