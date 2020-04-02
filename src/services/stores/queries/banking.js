import gql from 'graphql-tag';

export const validateBankAccount = gql`
  mutation validateBankAccount($accountNumber: String!, $routingNumber: String!, $accountId: String!, $accountType:  InvestorAccountTypeEnum!) {
    validateBankAccount(accountNumber: $accountNumber, routingNumber: $routingNumber, accountId: $accountId, accountType: $accountType ) {
      responseCode
      bankName
    }
  }
  `;

export const declineBankChangeRequest = gql`
  mutation declineBankChangeRequest($accountId: String!, $userId: String, $justification: String) {
    declineBankChangeRequest(accountId: $accountId,userId: $userId, justification: $justification)
  }`;

export const getDecryptedRoutingNumber = gql`
mutation getDecryptedRoutingNumber($userId: String, $accountId: String, $requestType:RequestTypeEnum!) {
  getDecryptedRoutingNumber(userId: $userId, accountId: $accountId, requestType: $requestType) 
 }
`;

export const hasPendingTransfersWithPendingBankChange = gql`
query hasPendingTransfersWithPendingBankChange($accountId: String!) {
  hasPendingTransfersWithPendingBankChange(accountId: $accountId)
}
`;
