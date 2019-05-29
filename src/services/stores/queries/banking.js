import gql from 'graphql-tag';

export const linkBankRequestPlaid = gql`
  mutation linkBankRequestPlaid($plaidPublicToken:  String!, $plaidAccountId:  String!, $accountId:  String!) {
    linkBankRequestPlaid(plaidPublicToken: $plaidPublicToken, plaidAccountId:$plaidAccountId, accountId:$accountId) {
      status
      lastDigits
      dateRequested
    }
  }
`;

export const linkBankRequestManual = gql`
  mutation linkBankRequestManual($bankRoutingNumber:  String!, $bankAccountNumber:  String!, $accountId:  String!, $accountType: accountTypeEnum!) {
    linkBankRequestManual(bankRoutingNumber: $bankRoutingNumber, bankAccountNumber:$bankAccountNumber, accountId:$accountId, accountType: $accountType) {
      status
      lastDigits
      dateRequested
    }
  }
`;
export const validateBankAccount = gql`
  mutation validateBankAccount($accountNumber: String!, $routingNumber: String!, $accountId: String!, $accountType:  InvestorAccountTypeEnum!) {
    validateBankAccount(accountNumber: $accountNumber, routingNumber: $routingNumber, accountId: $accountId, accountType: $accountType ) {
      responseCode
      bankName
    }
  }
  `;

export const linkBankRequestCancel = gql`
  mutation linkBankRequestCancel($accountId: String!) {
    linkBankRequestCancel(accountId: $accountId)
  }
`;

export const getDecryptedRoutingNumber = gql`
mutation getDecryptedRoutingNumber($userId: String, $accountId: String, $requestType:RequestTypeEnum!) {
  getDecryptedRoutingNumber(userId: $userId, accountId: $accountId, requestType: $requestType) 
 }
`;
