import gql from 'graphql-tag';

export const allMonthlyStatements = gql`
  query _getAccountStatements($accountId: String!) {
    investorAccountStatements(accountId: $accountId){
      accountId
      statementDate
      description
      file {
        fileId
        fileName
      }
    }
  }
`;

export const generateMonthlyStatementsPdf = gql`
mutation generateMonthlyStatementsPdf($userId: String!, $accountId: String!, $month: Int, $year: Int) {
  generateMonthlyStatementsPdf(userId: $userId, accountId: $accountId, month: $month, year: $year){
    pdfUrl
  }
}
`;

export const allTaxForms = gql`
  query _getAccountTaxForm($accountId: String!) {
    investorAccountTaxForms(accountId: $accountId){
      accountId
      taxFormDate
      types
      file {
        fileId
        fileName
      }
    }
  }
`;
export const downloadFile = gql`
  mutation downloadFile($fileId: String!) {
    downloadFile (
      fileId: $fileId
    ) {
      preSignedUrl
    }
  }
`;
