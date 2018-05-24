import gql from 'graphql-tag';

export const allKbsQuery = gql`
  query allKnowledgeBases {
    allKnowledgeBases{
      id
      heading
      description
    }
  }
`;
