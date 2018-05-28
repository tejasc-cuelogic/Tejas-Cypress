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

export const allFaqCategories = gql`
  query allCategories {
    allCategories{
      id
      name
      faqs{
        id
        text
      }
    }
  }
`;

export const getFirstFaq = gql`
  query GetFaq($first: Int!) {
    allFaqs(first: $first, skip: 0) {
      id
      text
      description
    }
  }
`;

export const getOneFaq = gql`
  query GetOneFaq($id: ID!) {
    Faq(id: $id) {
      id
      text
      description
    }
  }
`;
