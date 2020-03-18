import { FormHelper } from '../../../../helper';

const TOMBSTONE_TOGGLE_META = [
  { label: 'Investor Count', value: 'INVESTOR_COUNT' },
];

const HEADER_TOGGLE_META = [
  { label: 'Days Left', value: 'DAYS_LEFT' },
  { label: 'Investor Count', value: 'INVESTOR_COUNT' },
  { label: 'Early Bird', value: 'EARLY_BIRD' },
];

const SUB_HEADER_TOGGLE_META = [
  { label: 'Investor Count', value: 'INVESTOR_COUNT' },
  { label: 'Raised Amount', value: 'RAISED_AMOUNT' },
  { label: 'Days Left', value: 'DAYS_LEFT' },
];

export const TOMBSTONE_BASIC = FormHelper.generateMeta([
  ['description', 'Tombstone Description', '', 'optional', 'Describe your project and what you`re raising funds to accomplish.'],
  ['customTag', 'Tombstone Custom Tag', '', 'optional', 'Enter here...'],
  ['toggleMeta', 'Toggle Meta', [], 'optional', 'Enter here...', { asIn: true, props: { defaultValue: [], values: TOMBSTONE_TOGGLE_META } }],
  ['image', 'Tombstone Image', '', 'optional', '', { s3Upload: true }],
]);

export const SUB_HEADER_BASIC = FormHelper.generateMeta([
  ['toggleMeta', 'Toggle Meta', [], 'optional', 'Enter here...', { asIn: true, props: { defaultValue: [], values: SUB_HEADER_TOGGLE_META } }],
  ]);

export const HEADER_BASIC = FormHelper.generateMeta([
  ['heroVideoURL', 'Hero Video URL', '', 'optional', 'Enter here...'],
  ['toggleMeta', 'Toggle Meta', [], 'optional', 'Enter here...', { asIn: true, props: { defaultValue: [], values: HEADER_TOGGLE_META } }],
  ['heroImage', 'Hero Image', '', 'optional', '', { s3Upload: true }],
  ['heroBackgroundImage', 'Hero Background Image', '', 'optional', '', { s3Upload: true }],
]);

export const OFFERING_MISC = FormHelper.generateMeta([
  ['facebook_url', 'Facebook', '', 'optional', 'e.g. http://facebook.com/nextbrewery', { asIn: true, props: { find: 'type', type: 'facebook', skipField: true, ArrayObjItem: true, objRef: 'social' } }],
  ['twitter_url', 'Twitter', '', 'optional', 'e.g. http://twitter.com/nextbrewery', { asIn: true, props: { find: 'type', type: 'twitter', skipField: true, ArrayObjItem: true, objRef: 'social' } }],
  ['linkedin_url', 'LinkedIn', '', 'optional', 'e.g. http://linkedin.com/nextbrewery', { asIn: true, props: { find: 'type', type: 'linkedin', skipField: true, ArrayObjItem: true, objRef: 'social' } }],
  ['instagram_url', 'Instagram', '', 'optional', 'e.g. http://instagram.com/nextbrewery', { asIn: true, props: { find: 'type', type: 'instagram', skipField: true, ArrayObjItem: true, objRef: 'social' } }],
  ['yelp_url', 'Yelp', '', 'optional', 'e.g. http://yelp.com/nextbrewery', { asIn: true, props: { find: 'type', type: 'yelp', skipField: true, ArrayObjItem: true, objRef: 'social' } }],
  ['facebook_shareLink', 'Sharelink', '', 'optional', 'e.g. http://facebook.com/nextbrewery', { asIn: true, props: { find: 'type', type: 'facebook', skipField: true, ArrayObjItem: true, objRef: 'social' } }],
  ['facebook_blurb', 'Blurb', '', 'optional', 'e.g. Company was formed...', { asIn: true, props: { find: 'type', type: 'facebook', skipField: true, ArrayObjItem: true, objRef: 'social' } }],
  ['facebook_featuredImageUpload', 'Featured Upload image', '', 'optional', 'e.g. Company was formed...', { s3Upload: true, asIn: true, props: { find: 'type', type: 'facebook', skipField: true, ArrayObjItem: true }, objRef: 'social' }],
  ['twitter_shareLink', 'Sharelink', '', 'optional', 'e.g. http://twitter.com/nextbrewery', { asIn: true, props: { find: 'type', type: 'twitter', skipField: true, ArrayObjItem: true, objRef: 'social' } }],
  ['twitter_blurb', 'Blurb', '', 'optional', 'e.g. Company was formed...', { asIn: true, props: { find: 'type', type: 'twitter', skipField: true, ArrayObjItem: true, objRef: 'social' } }],
  ['twitter_featuredImageUpload', 'Featured Upload image', '', 'optional', 'e.g. Company was formed...', { s3Upload: true, asIn: true, props: { find: 'type', type: 'twitter', skipField: true, ArrayObjItem: true }, objRef: 'social' }],
  ['issuerStatement', 'Issuer Statement', '', 'optional', 'Enter here...'],
  ['logo', 'Logo', '', 'optional', '', { s3Upload: true }],
  ['avatar', 'Company Avatar', '', 'optional', '', { s3Upload: true }],
]);

export const OFFERING_CONTENT = {
  content: [{
    title: {
      label: 'Title',
      value: '',
      error: undefined,
      rule: 'required',
      placeHolder: 'e.g. Investment Term',
    },
    order: {
      label: 'Order',
      value: 1,
      error: undefined,
      rule: 'optional',
      placeHolder: 'e.g. 1',
      defaultValue: 1,
    },
    scope: {
      label: 'Scope',
      value: '',
      error: undefined,
      rule: 'required',
      options: [
        { key: 'PUBLIC', value: 'PUBLIC', text: 'Public' },
        { key: 'ACCREDITED_HIDDEN', value: 'ACCREDITED_HIDDEN', text: 'Accredited Hidden' },
        { key: 'ACCREDITED_REQUIRED', value: 'ACCREDITED_REQUIRED', text: 'Accredited Required' },
        { key: 'HIDDEN', value: 'HIDDEN', text: 'Hidden' },
      ],
      placeHolder: 'Enter here',
    },
    contentType: {
      label: 'Content Type',
      value: '',
      error: undefined,
      rule: 'required',
      options: [
        { key: 'CUSTOM', value: 'CUSTOM', text: 'Custom' },
        { key: 'INVESTMENT_DETAILS', value: 'INVESTMENT_DETAILS', text: 'Investment Details' },
        { key: 'BONUS_REWARDS', value: 'BONUS_REWARDS', text: 'Bonus Rewards' },
        { key: 'DATA_ROOM', value: 'DATA_ROOM', text: 'Data Room' },
        { key: 'GALLERY', value: 'GALLERY', text: 'Gallery' },
        { key: 'COMMENTS', value: 'COMMENTS', text: 'Comments' },
        { key: 'UPDATES', value: 'UPDATES', text: 'Updates' },
      ],
      placeHolder: 'Enter here',
    },
    customValue: {
      label: 'Custom Value',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: 'e.g. Custom Value',
    },
  }],
};

export const TOMBSTONE_HEADER_META = {
  meta: [{
    keyLabel: {
      label: 'Key Name',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: 'e.g. Multiple',
    },
    keyType: {
      label: 'Key Type',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: 'e.g. mapped',
      options: [
        { key: 'mapped', value: 'mapped', text: 'Mapped' },
        { key: 'custom', value: 'custom', text: 'Custom' },
      ],
    },
    keyValue: {
      label: 'Key Value',
      value: '',
      error: undefined,
      rule: 'optional',
      options: [
        { key: 'multiple', value: 'keyTerms.investmentMultiple', text: 'Multiple' },
        { key: 'Max Offering Amount CF', value: 'keyTerms.maxOfferingAmountCF', text: 'Max Offering Amount CF' },
        { key: 'Max Offering Amount 506', value: 'keyTerms.maxOfferingAmount506', text: 'Max Offering Amount 506' },
        { key: 'Max Offering Amount 506C', value: 'keyTerms.maxOfferingAmount506C', text: 'Max Offering Amount 506C' },
        { key: 'Min Offering Amount CF', value: 'keyTerms.minOfferingAmountCF', text: 'Min Offering Amount CF' },
        { key: 'Min Offering Amount 506', value: 'keyTerms.minOfferingAmount506', text: 'Min Offering Amount 506' },
        { key: 'Min Offering Amount 506C', value: 'keyTerms.minOfferingAmount506C', text: 'Min Offering Amount 506C' },
        { key: 'Security', value: 'keyTerms.securities', text: 'Security' },
        { key: 'Maturity', value: 'keyTerms.maturity', text: 'Maturity' },
        { key: 'Regulation', value: 'keyTerms.regulation', text: 'Regulation' },
        { key: 'Total Round Size', value: 'keyTerms.totalRoundSize', text: 'Total Round Size' },
        { key: 'Preferred Return', value: 'keyTerms.preferredReturn', text: 'Preferred Return' },
        { key: 'Offering Size', value: 'keyTerms.offeringSize', text: 'Offering Size' },
      ],
      placeHolder: 'Enter here',
    },
    keyFormat: {
      label: 'Key Format',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: 'e.g. $100',
      tooltip: 'Please use {{var}} to replace with variable selected.',
    },
    isHighlight: {
      value: false,
      defaultValue: false,
      values: [
        {
          label: 'Highlight',
          value: 'TRUE',
        },
      ],
      error: undefined,
      rule: 'optional',
      placeHolder: '',
      // skipField: true,
    },
  }],
};
