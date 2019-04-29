import gql from 'graphql-tag';

export const getInvestorListForOffering = gql`
  query getInvestorListForOffering ($offeringId: String!) {
    getInvestorListForOffering (offeringId: $offeringId) {
      userId
      firstName
      lastName
      city
      state
      amount
      investmentDate
      userEmail
      referralCode {
        code
        isValid
      }
      avatar
      investmentsCount
      accountType
      credit
      autoDraftAmount
    }
  }
`;
