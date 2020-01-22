import gql from 'graphql-tag';

export const adminListLinkedBankUsers = gql`
query adminListLinkedBankUsers($page: Int, $limit: Int!, $status: [ChangeBankRequestStatusEnum]) {
    adminListLinkedBankUsers (page: $page, limit: $limit, status: $status){
     linkedBankList {
      userId
      accountId
      firstName
      lastName
      accountType
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
      userInfo {
        locked {
          lock
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

export const adminLinkedBankApprove = gql`
mutation adminLinkedBankApprove($accountId: String!, $userId: String!, $justification: String!) {
  adminLinkedBankApprove(
    userId: $userId
    accountId: $accountId
    justification: $justification
  ){
    verified
    message
  }
}`;
