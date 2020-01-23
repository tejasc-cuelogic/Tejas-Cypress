import gql from 'graphql-tag';

export const getJobListing = gql`
query getJobListing{
    getJobListing
    {
    POSITION
    CITY
    STATE
    BOX_FILE_ID
    STATUS
    }
    }
`;

export const spaceHelpAndQuestion = gql`
mutation _spaceHelpAndQuestion($spaceDetails : SpaceHelpAndQuestionInput) {
    spaceHelpAndQuestion (spaceDetails: $spaceDetails)
  }
`;
