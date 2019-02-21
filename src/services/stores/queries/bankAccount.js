import gql from 'graphql-tag';

export const getlistLinkedBankUsers = gql`
query getlistLinkedBankUsers($page: Int, $limit: Int!, $status: [ChangeBankRequestStatusEnum]) {
    listLinkedBankUsers (page: $page, limit: $limit, status: $status){
     linkedBankList {
      userId
      accountId
      firstName
      lastName
      email
      linkedBank {
        changeRequest {
          accountNumber
          routingNumber
          plaidAccessToken
          plaidAccountId
          status
          dateRequested
        }
      }
    }
    resultCount
    }
  }
`;

export const isValidOpeningDepositAmount = gql`
  query isValidOpeningDepositAmount($accountAttributes: AccountInputType! $accountType: InvestorAccountTypeEnum! $accountId: String) {
    isValidOpeningDepositAmount(
      accountAttributes: $accountAttributes
      accountType: $accountType,
      accountId: $accountId
    )
  }`;

export const updateLinkedAccount = gql`
mutation _verifyLinkedBank($accountId: String!, $userId: String!) {
  verifyLinkedBank(
    userId: $userId
    accountId: $accountId
  ){
    verified
    message
  }
}`;
