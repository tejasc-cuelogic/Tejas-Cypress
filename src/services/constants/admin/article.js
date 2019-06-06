export const ARTICLES = {
  title: {
    value: '', label: 'Title', error: undefined, rule: 'required', placeholder: 'Click to edit article name',
  },
  articleStatus: {
    value: '', label: 'Status', error: undefined, rule: 'required',
  },
  author: {
    value: '', label: 'Author', error: undefined, rule: 'required',
  },
  categoryId: {
    value: '', label: 'Category', error: undefined, rule: 'required',
  },
  minuteRead: {
    value: '', label: 'Min Read', error: undefined, rule: 'optional', defaultValue: 0,
  },
  banner: {
    value: '', label: 'Banner', error: undefined, rule: 'optional',
  },
  slug: {
    value: '', label: 'Slug', error: undefined, rule: 'required',
  },
  tags: {
    value: '', label: 'Tags', error: undefined, rule: 'optional',
  },
  content: {
    value: '', label: 'description', error: undefined, rule: 'required',
  },
  featuredImage: {
    fileName: '', value: '', base64String: '', objType: 's3File', src: '', meta: {}, label: 'Featured Image', error: undefined, rule: 'optional', showLoader: false, preSignedUrl: '', fileId: '', fileData: '', customErrors: { required: 'required' },
  },
  isFeatured: {
    value: '', label: 'Featured Insight', error: undefined, rule: 'optional',
  },
};

export const THUMBNAIL_EXTENSIONS = ['jpeg', 'jpg', 'png'];

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

export const ARTICLE_STATUS_VALUES = [
  { key: 'PUBLISHED', value: 'PUBLISHED', text: 'Published' },
  { key: 'DRAFT', value: 'DRAFT', text: 'Draft' },
  { key: 'IN_REVIEW', value: 'IN_REVIEW', text: 'In Review' },
];

export const GLOBAL_ACTIONS = [
  { key: 'Delete', value: 'delete', text: 'Delete' },
];
