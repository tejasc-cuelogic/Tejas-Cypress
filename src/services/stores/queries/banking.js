import gql from 'graphql-tag';

export const changeLinkedBank = gql`
  mutation addLinkedBank($plaidPublicToken:  String!, $plaidAccountId:  String!, $accountId:  String!) {
    addLinkedBank(plaidPublicToken: $plaidPublicToken, plaidAccountId:$plaidAccountId, accountId:$accountId) {
      status
      lastDigits
      dateRequested
    }
  }
`;

export const changeBankManually = gql`
  mutation linkBankManually($bankRoutingNumber:  String!, $bankAccountNumber:  String!, $accountId:  String!) {
    linkBankManually(bankRoutingNumber: $bankRoutingNumber, bankAccountNumber:$bankAccountNumber, accountId:$accountId) {
      status
      lastDigits
      dateRequested
    }
  }
`;

export const cancelBankRequest = gql`
  mutation cancelBankChangeRequest($accountId: String!) {
    cancelBankChangeRequest(accountId: $accountId)
  }
`;

export const getDecryptedRoutingNumber = gql`
mutation getDecryptedRoutingNumber($userId: String, $accountId: String, $requestType:RequestTypeEnum!) {
  getDecryptedRoutingNumber(userId: $userId, accountId: $accountId, requestType: $requestType) 
 }
`;
