import gql from 'graphql-tag';

export const createUserAccountIndividual = gql`
  mutation _createUserAccountIndividual(
    $userId: String!
    $plaidPublicToken: String
    $plaidAccountId: String
    $bankName: String
    $accountNumber: String
    $routingNumber: String
    $accountType: UserAccountTypeEnum!
  ){
    createIndividualAccount(
      userId: $userId,
      plaidPublicToken: $plaidPublicToken,
      plaidAccountId: $plaidAccountId,
      bankName: $bankName,
      accountNumber: $accountNumber, 
      routingNumber: $routingNumber,
      accountType: $accountType
    ) {
      userId
      accountId
      accountType
      status
      startedDate
      finishedDate
      accountDetails
    }
  }`;

export const finalizeIndividualAccount = gql`
  mutation _finalizeIndividualAccount($userId: String! $accountId: String! $funds: Int) {
    depositFundsIndividualAccount(
      userId: $userId,
      accountId: $accountId,
      funds: $funds
    ) {
      userId
      accountId
      accountType
      status
      startedDate
      finishedDate
      accountDetails
    }
  }`;

export const createAccount = gql`
  mutation _createAccount($userId: String! $accountAttributes: AccountInputType! $status: AccountCreationStatusEnum! $accountType: UserAccountTypeEnum!) {
    createInvestorAccount(
      userId: $userId
      accountAttributes: $accountAttributes
      status: $status
      accountType: $accountType
    ) {
      userId
      accountId
      accountType
      status
      startedDate
      finishedDate
      accountDetails
    }
    
  }`;
