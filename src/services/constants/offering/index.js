export const UPDATES = {
  title: {
    value: '', label: 'Title', error: undefined, rule: 'required', placeHolder: 'Enter update title here...',
  },
  content: {
    value: '', label: 'description', error: undefined, rule: 'required',
  },
  lastUpdate: {
    value: '', label: 'lastUpdate', error: undefined, rule: 'optional',
  },
  status: {
    value: 'DRAFT', label: 'Status', error: undefined, rule: 'required',
  },
  tiers: {
    value: [],
    values: [],
    error: undefined,
    rule: 'optional',
    key: 0,
  },
  scope: {
    value: 'PUBLIC',
    values: [{ label: 'Public', value: 'PUBLIC' }, { label: 'Investors Only', value: 'INVESTORS' }],
    error: undefined,
    rule: 'optional',
  },
  updatedDate: {
    value: '', label: 'Updated Date', error: undefined, rule: 'optional', placeHolder: 'Updated Date',
  },
};

export const TEMPLATE = {
  type: {
    label: 'Template Type',
    value: 'LIVE',
    values: [{ label: 'Live', value: 'LIVE' }, { label: 'Full', value: 'FULL' }],
    error: undefined,
    rule: 'required',
  },
};

export const OFFERING_STAGE = {
  CREATION: 'CREATION',
  LIVE: 'LIVE',
  CLOSE: 'CLOSE',
  ENGAGEMENT: 'ENGAGEMENT',
  COMPLETE: 'COMPLETE',
  FAILED: 'FAILED',
  TERMINATED: 'TERMINATED',
};

export const BUSINESS_INDUSTRIES = [
  { content: 'CRE', value: 'COMMERCIAL_REAL_ESTATE', iconName: 'building' },
  {
    content: 'Food & beverage', value: 'FOOD_AND_BEVERAGE', text: 'Food & beverage', iconName: 'food',
  },
  {
    content: 'Fashion & merchandising', value: 'FASHION_AND_MERCHANDISING', text: 'Fashion & merchandising', iconName: 'shopping bag',
  },
  {
    content: 'Real estate', value: 'REAL_ESTATE', text: 'Real estate', iconName: 'building',
  },
  {
    content: 'Beauty & spa', value: 'BEAUTY_AND_SPA', text: 'Beauty & spa', iconName: 'bed',
  },
  {
    content: 'Fitness & wellness', value: 'FITNESS_AND_WELLNESS', text: 'Fitness & wellness', iconName: 'bicycle',
  },
  {
    content: 'Technology', value: 'TECHNOLOGY', text: 'Technology', iconName: 'keyboard',
  },
  {
    content: 'Hospitality', value: 'HOSPITALITY', text: 'Hospitality', iconName: 'bed',
  },
  {
    content: 'Restaurant & Bar', value: 'RESTAURANT_AND_BAR', text: 'Restaurant & Bar', iconName: 'food',
  },
  {
    content: 'Brewery & Brewpub', value: 'BREWERY_AND_BREWPUB', text: 'Brewery & Brewpub', iconName: 'bar',
  },
  {
    content: 'Health & Wellness', value: 'HEALTH_AND_WELLNESS', text: 'Health & Wellness', iconName: 'heartbeat',
  },
  {
    content: 'Fashion & apparel', value: 'FASHION_AND_APPAREL', text: 'Fashion & apparel', iconName: 'shopping bag',
  },
  {
    content: 'Other', value: 'OTHER', text: 'Other', iconName: 'ellipsis horizontal',
  },
];
