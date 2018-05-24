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

export const getFirst = gql`
  query GetKnowledgeBase($first: Int!) {
    allKnowledgeBases(first: $first, skip: 0) {
      id
      heading
      description
    }
  }
`;

export const getOne = gql`
  query GetOneKnowledgeBase($id: ID!) {
    KnowledgeBase(id: $id) {
      id
      heading
      description
    }
  }
`;
