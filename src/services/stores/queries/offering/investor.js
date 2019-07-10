import gql from 'graphql-tag';

export const getInvestorListForOffering = gql`
  query getInvestorListForOffering ($offeringId: String!) {
    getInvestorListForOffering (offeringId: $offeringId) {
      userId
      firstName
      lastName
      street
      streetTwo
      city
      state
      zipCode
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
      earlyBirdEligibility
    }
  }
`;
