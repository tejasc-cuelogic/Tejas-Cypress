import gql from 'graphql-tag';

export const createBusinessApplicationPrequalificaiton = gql`
mutation _submitBusinessApplicationPreQualStepSuccessScenario($preQualificationData: String!) {
  createBusinessApplicationPrequalificaiton(data: $preQualificationData) {
    status
    id
  }
}
`;
