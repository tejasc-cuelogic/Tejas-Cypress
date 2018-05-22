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

export const updateAccount = gql`
  mutation _updateAccount {
    updateInvestorAccount(
      userId:"49d20a2b-c409-4bb6-ad31-de4bc0c5bfcf"
      accountId: "a58c1c20-5ce1-11e8-9032-97b00f84623b"
      accountAttributes: {
        netWorth: 100000,
        annualIncome: 5000000
        iraAccountType: traditional
        fundingType: check
        identityDoc: "xyz"
      }
      status: submit
      accountType: ira
    ) {
      userId
      accountId
      accountType
      status
      startedDate
      finishedDate
      accountDetails
  }`;
