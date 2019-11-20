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
  allInvestor: {
    value: false,
    error: undefined,
    rule: 'optional',
  },
  shouldSendInvestorNotifications: {
    value: false,
    error: undefined,
    rule: 'optional',
  },
  scope: {
    value: 'PUBLIC',
    values: [{ label: 'Public', value: 'PUBLIC' }, { label: 'Investors Only', value: 'INVESTORS' }],
    error: undefined,
    rule: 'optional',
  },
  updatedDate: {
    value: '', label: 'Published Date', error: undefined, rule: 'date', placeHolder: 'MM-DD-YYYY',
  },
};

export const TEMPLATE = {
  type: {
    label: 'Email Template',
    value: 'LIVE',
    values: [{ label: 'Link', value: 'LIVE' }, { label: 'In Body', value: 'FULL' }],
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

export const USER_REWARDS_META = [
  {
    id: 'cjicstk6f0gaf0136nxmoo85k',
    name: 'MuHu Hot Pot',
    rewards: [
      {
        id: 'cjict4vih0jhr0126yirl8eo3',
        name: '$50 Gift Card',
        description: '$50 Gift Card description',
        expiry: '2018-05-26T00:00:00.000Z',
        status: 'Available',
        redeemDate: null,
      },
      {
        id: 'cjictb8wv0lip0136nmtetgu2',
        name: 'VIP Access Card',
        description: 'VIP Access Card description',
        expiry: '2020-05-26T00:00:00.000Z',
        status: 'Available',
        redeemDate: null,
      },
    ],
  },
  {
    id: 'cjicsu0ps0f8b0100ra7pyg0x',
    name: 'The Brewers Table',
    rewards: [],
  },
];
