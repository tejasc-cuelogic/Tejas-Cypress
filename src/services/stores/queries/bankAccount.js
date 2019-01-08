import gql from 'graphql-tag';

export const getlistLinkedBankUsers = gql`
query getlistLinkedBankUsers($page: Int, $limit: Int!, $status: [ChangeBankRequestStatusEnum]) {
    listLinkedBankUsers (page: $page, limit: $limit, status: $status){
     linkedBankList {
      userId
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

export const checkOpeningDepositAmount = gql`
  mutation checkOpeningDepositAmount($accountAttributes: AccountInputType! $accountType: InvestorAccountTypeEnum! $accountId: String) {
    checkOpeningDepositAmount(
      accountAttributes: $accountAttributes
      accountType: $accountType,
      accountId: $accountId
    )
  }`;
