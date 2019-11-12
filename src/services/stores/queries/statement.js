import gql from 'graphql-tag';

export const generateMonthlyStatementsPdf = gql`
mutation generateMonthlyStatementsPdf($userId: String!, $accountId: String!, $month: Int, $year: Int) {
  generateMonthlyStatementsPdf(userId: $userId, accountId: $accountId, month: $month, year: $year){
    pdfUrl
  }
}
`;

export const downloadFile = gql`
query getBoxDownloadLinkByFileId($fileId: String, $accountType: UploadAccountTypeEnum ) {
    getBoxDownloadLinkByFileId (
      boxFileId: $fileId
      accountType: $accountType
    ) {
      preSignedUrl
    }
  }
`;
