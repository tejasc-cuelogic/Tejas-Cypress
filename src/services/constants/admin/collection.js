import { FormHelper } from '../../../helper';
// [key, label, value, rule, placeHolder, additionalProps];

export const COLLECTION = FormHelper.generateMeta([
  ['name', 'Name', '', 'required', 'Click to edit article name'],
  ['slug', 'Slug', '', 'required', 'Enter here'],
]);

export const OVERVIEW = FormHelper.generateMeta([
  ['slug', 'Slug', '', 'required', 'Enter here'],
  ['previewPassword', 'Preview Password', '', 'required', 'Enter here'],
]);

const COMMON_TOMBSTONE_META = {
  ...FormHelper.generateMeta([
    ['title', 'Title', '', 'optional', 'Enter Here'],
    ['bgColor', 'Background Color', '', 'optional', 'Enter Here'],
    ['descriptionColor', 'Description Color', '', 'optional', 'Enter Here'],
    ['description', 'Description', '', 'optional', 'Describe your project and what you`re raising funds to accomplish.'],
    ['bgImage', 'BackGround Image', '', 'optional', '', { s3Upload: true }],
    ['image', 'Featured Image', '', 'optional', '', { s3Upload: true }],
  ]),
};

export const TOMBSTONE_BASIC = {
  ...FormHelper.generateMeta([
    ['color', 'Tag Color', '', 'optional', 'Enter Here', { asIn: true, props: { objRefOutput: 'tag', objRef: 'tag' } }],
    ['text', 'Tag Text', '', 'optional', 'Enter Here', { asIn: true, props: { objRefOutput: 'tag', objRef: 'tag' } }],
    ['textColor', 'Tag Text Color', '', 'optional', 'Enter Here', { asIn: true, props: { objRefOutput: 'tag', objRef: 'tag' } }],
  ]),
  ...COMMON_TOMBSTONE_META,
};

export const COLLECTION_MAPPING = FormHelper.generateMeta([
  ['mappingMeta', 'Collection Mapping', '', '', ''],
]);

export const HEADER_META = {
  meta: [{
    ...COMMON_TOMBSTONE_META,
    social: [FormHelper.generateMeta([
      ['type', 'Type', '', '', ''],
      ['icon', 'Icon', '', '', ''],
      ['iconColor', 'Icon Color', '', '', ''],
      ['url', 'URL', '', '', ''],
    ]),
    ],
  }],
};

export const CARD_HEADER_META = {
  ...TOMBSTONE_BASIC,
};

export const CARD_HEADER_SOCIAL_META = {
  social: [{
    url: {
      label: 'Url',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: '',
    },
    type: {
      label: 'Type',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: '',
      options: [
        { key: 'facebook', value: 'facebook', text: 'facebook' },
        { key: 'linkedin', value: 'linkedin', text: 'linkedin' },
        { key: 'twitter', value: 'twitter', text: 'twitter' },
        { key: 'instagram', value: 'instagram', text: 'instagram' },
        { key: 'yelp', value: 'yelp', text: 'yelp' },
        { key: 'website', value: 'website', text: 'website' },
      ],
    },
  }],
};

export const COLLECTION_MISC = FormHelper.generateMeta([
  ['facebook_shareLink', 'Sharelink', '', 'optional', 'e.g. http://facebook.com/nextbrewery', { asIn: true, props: { find: 'type', type: 'facebook', skipField: true, ArrayObjItem: true, objRef: 'social' } }],
  ['facebook_blurb', 'Blurb', '', 'optional', 'e.g. Company was formed...', { asIn: true, props: { find: 'type', type: 'facebook', skipField: true, ArrayObjItem: true, objRef: 'social' } }],
  ['facebook_featuredImageUpload', 'Featured Upload image', '', 'optional', 'e.g. Company was formed...', { s3Upload: true, asIn: true, props: { find: 'type', type: 'facebook', skipField: true, ArrayObjItem: true }, objRef: 'social' }],
  ['twitter_shareLink', 'Sharelink', '', 'optional', 'e.g. http://twitter.com/nextbrewery', { asIn: true, props: { find: 'type', type: 'twitter', skipField: true, ArrayObjItem: true, objRef: 'social' } }],
  ['twitter_blurb', 'Blurb', '', 'optional', 'e.g. Company was formed...', { asIn: true, props: { find: 'type', type: 'twitter', skipField: true, ArrayObjItem: true, objRef: 'social' } }],
  ['twitter_featuredImageUpload', 'Featured Upload image', '', 'optional', 'e.g. Company was formed...', { s3Upload: true, asIn: true, props: { find: 'type', type: 'twitter', skipField: true, ArrayObjItem: true }, objRef: 'social' }],
]);


export const CONTENT = {
  content: [{
    title: {
      label: 'Title',
      value: '',
      error: undefined,
      rule: 'required',
      placeHolder: 'e.g. Investment Term',
    },
    description: {
      label: 'Description',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: 'Enter Here',
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
        // { key: 'ACCREDITED_HIDDEN', value: 'ACCREDITED_HIDDEN', text: 'Accredited Hidden' },
        // { key: 'ACCREDITED_REQUIRED', value: 'ACCREDITED_REQUIRED', text: 'Accredited Required' },
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
        { key: 'ACTIVE_INVESTMENTS', value: 'ACTIVE_INVESTMENTS', text: 'Active Investments' },
        { key: 'COMPLETE_INVESTMENTS', value: 'COMPLETE_INVESTMENTS', text: 'Complete Investments' },
        { key: 'INSIGHTS', value: 'INSIGHTS', text: 'Insights' },
      ],
      placeHolder: 'Enter here',
    },
    // meta: {
    //   ...COMMON_TOMBSTONE_META,
    //   social: [FormHelper.generateMeta([
    //     ['type', 'Type', '', '', ''],
    //     ['icon', 'Icon', '', '', ''],
    //     ['iconColor', 'Icon Color', '', '', ''],
    //     ['url', 'URL', '', '', ''],
    //   ]),
    //   ],
    // },
    customValue: {
      label: 'Custom Value',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: 'e.g. Custom Value',
    },
  }],
};
