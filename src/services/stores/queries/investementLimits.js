import gql from 'graphql-tag';

export const finLimit = gql`
  query FinancialLimits {
    FinancialLimits(id:"cjheqz99f0dzu0171soskx0pp") {
      id
      annualIncome
      netWorth
      otherInvestments
      currentLimit
    }
  }
`;

export const updateFinLimit = gql`
  mutation updateFinancialLimits($annualIncome: Int!, $netWorth: Int!, $otherInvestments: Int!, $currentLimit: Int!){
    updateFinancialLimits(
      id: "cjheqz99f0dzu0171soskx0pp",
      annualIncome: $annualIncome,
      netWorth: $netWorth,
      otherInvestments: $otherInvestments,
      currentLimit: $currentLimit,
    ) {
      id
      annualIncome
      netWorth
      otherInvestments
      currentLimit
    }
  }
`;

export const getInvestorInvestmentLimit = gql`
  query getInvestorInvestmentLimit($userId: ID!, $accountId: ID!) {
    getInvestorInvestmentLimit(userId: $userId, accountId: $accountId)
  }
`;

