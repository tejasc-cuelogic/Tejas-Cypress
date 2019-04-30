export const KNOWLEDGE_BASE = {
  title: {
    value: '', label: 'Title', error: undefined, rule: 'required', placeholder: 'Click to edit article name',
  },
  itemStatus: {
    value: '', label: 'Status', error: undefined, rule: 'required',
  },
  authorName: {
    value: '', label: 'Author', error: undefined, rule: 'required',
  },
  categoryId: {
    value: '', label: 'Category', error: undefined, rule: 'required',
  },
  content: {
    value: '', label: 'description', error: undefined, rule: 'required',
  },
  userType: {
    key: 'userType',
    value: 'INVESTOR',
    values: [
      { label: 'Investor', name: 'Investor', value: 'INVESTOR' },
      { label: 'Issuer', name: 'Issuer', value: 'ISSUER' },
    ],
    label: 'User Type',
    error: undefined,
    rule: 'optional',
  },
};

export const CATEGORY_VALUES = [
  { key: 'All', value: 'All', text: 'All' },
  { key: 'For Businesses', value: 'forBusinesses', text: 'For Businesses' },
  { key: 'NextSeed Updates', value: 'nextSeedUpdates', text: 'NextSeed Updates' },
  { key: 'NextSeed TX', value: 'nextSeedTX', text: 'NextSeed TX' },
  { key: 'Community', value: 'community', text: 'Community' },
  { key: 'For Investors', value: 'forInvestors', text: 'For Investors' },
  { key: 'NextSeed Stories', value: 'nextSeedStories', text: 'NextSeed Stories' },
];

export const TAGS = [
  { key: 'All', value: 'All', text: 'All' },
  { key: 'Finances', value: 'finances', text: 'Finances' },
  { key: 'Marketing', value: 'marketing', text: 'Marketing' },
  { key: 'Management', value: 'management', text: 'Management' },
  { key: 'Brewery', value: 'brewery', text: 'Brewery' },
];

export const KB_STATUS_VALUES = [
  { key: 'All', value: 'All', text: 'All' },
  { key: 'PUBLISHED', value: 'PUBLISHED', text: 'Published' },
  { key: 'DRAFT', value: 'DRAFT', text: 'Draft' },
  { key: 'IN_REVIEW', value: 'IN_REVIEW', text: 'In review' },
];

export const ITEM_STATUS_VALUES = [
  { key: 'PUBLISHED', value: 'PUBLISHED', text: 'Published' },
  { key: 'DRAFT', value: 'DRAFT', text: 'Draft' },
  { key: 'IN_REVIEW', value: 'IN_REVIEW', text: 'In review' },
];

export const AUTHORS = [
  { key: 'All', value: 'All', text: 'All' },
  { key: 'John Smith', value: 'John Smith', text: 'John Smith' },
];

export const GLOBAL_ACTIONS = [
  { key: 'Delete', value: 'delete', text: 'Delete' },
  { key: 'PUBLISHED', value: 'PUBLISHED', text: 'Save to approve' },
  { key: 'DRAFT', value: 'DRAFT', text: 'Save to draft' },
  { key: 'IN_REVIEW', value: 'IN_REVIEW', text: 'Save to review' },
];

export const USER_TYPES = [
  { key: 'INVESTOR', value: 'INVESTOR', label: 'INVESTOR' },
  { key: 'ISSUER', value: 'ISSUER', label: 'ISSUER' },
];

export const CATEGORY_TYPES = {
  ISSUER_KB: 'Issuer Knowledge Base',
  INVESTOR_KB: 'Investor Knowledge Base',
  ALL: '',
};
