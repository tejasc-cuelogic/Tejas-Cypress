import gql from 'graphql-tag';

export const allMonthlyStatements = gql`
  query _getAccountStatements($accountId: String!) {
    investorAccountStatements(accountId: $accountId){
      accountId
      statementDate
      userId
      description
      file {
        fileId
        fileName
      }
    }
  }
`;

export const allTaxForms = gql`
  query _getAccountTaxForm($accountId: String!) {
    investorAccountTaxForms(accountId: $accountId){
      accountId
      taxFormDate
      userId
      types
      file {
        fileId
        fileName
      }
    }
  }
`;
