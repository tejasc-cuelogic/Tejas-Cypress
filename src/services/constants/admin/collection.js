import { FormHelper } from '../../../helper';
// [key, label, value, rule, placeHolder, additionalProps];

export const COLLECTION = FormHelper.generateMeta([
  ['title', 'Title', '', 'required', 'Click to edit article name'],
  ['content', 'description', '', 'required', ''],
  ['altContent', 'description', '', 'required', ''],
]);

export const OVERVIEW = FormHelper.generateMeta([
  ['offeringSlug', 'Collection URL', '', 'required', 'Enter here'],
  ['previewPassword', 'Preview Password', '', 'required', 'Enter here'],
  ['offeringreferralCodeSlug', 'Issuer Referral Code', '', 'required', 'Enter here'],
]);

export const TOMBSTONE_BASIC = {
  tag: {
    ...FormHelper.generateMeta([
      ['color', 'Colour', '', '', 'Enter Here'], ['text', 'text', '', '', 'Enter Here'],
    ]),
  },
  ...FormHelper.generateMeta([
  ['title', 'Title', '', 'required', 'Enter Here'],
  ['bgColor', 'Background Colour', '', 'optional', 'Enter Here'],
  ['description', 'Description', '', 'required', 'Describe your project and what you`re raising funds to accomplish.'],
  ['bgImage', 'BackGround Image', '', 'required', '', { s3Upload: true }],
  ['image', 'Featured Image', '', 'required', '', { s3Upload: true }],
]),
};

export const CONTENT = {
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
        { key: 'INVESTMENT_DETAILS', value: 'INVESTMENT_DETAILS', text: 'Investment Details' },
        { key: 'BONUS_REWARDS', value: 'BONUS_REWARDS', text: 'Bonus Rewards' },
        { key: 'DATA_ROOM', value: 'DATA_ROOM', text: 'Data Room' },
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
