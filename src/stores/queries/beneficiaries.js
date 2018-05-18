import gql from 'graphql-tag';

export const allBeneficiaries = gql`
  query allBeneficiaries {
    allBeneficiaries{
      id
      firstName
      lastName
      relationship
      street
      city
      state
      zipCode
      dob
    }
  }
`;

export const createBeneficiaryMutation = gql`
  mutation createBeneficiary($firstName: String!, $lastName: String!, $relationship: String!, $street: String!, $city: String!, $state: String!, $zipCode: String!, $dob: DateTime!, ) {
    createBeneficiary(firstName: $firstName, lastName: $lastName, relationship: $relationship, street: $street, city: $city, state: $state, zipCode: $zipCode, dob: $dob) {
      id
      firstName
      lastName
      relationship
      street
      city
      state
      zipCode
      dob
    }
  }
`;
