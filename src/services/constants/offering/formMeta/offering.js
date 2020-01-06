import { FormHelper } from '../../../../helper';

const TOMBSTONE_TOGGLE_META = [
  { label: 'Early Bird', value: 'EARLY_BIRD' },
  { label: 'Investor Count', value: 'INVESTOR_COUNT' },
];

const HEADER_TOGGLE_META = [
  { label: 'Early Bird', value: 'EARLY_BIRD' },
  { label: 'Investor Count', value: 'INVESTOR_COUNT' },
  { label: 'Repayment Count', value: 'REPAYMENT_COUNT' },
  { label: 'Days Left', value: 'DAYS_LEFT' },
];

export const TOMBSTONE_BASIC = FormHelper.generateMeta([
  ['description', 'Tombstone Description', '', 'optional', 'Describe your project and what you`re raising funds to accomplish.'],
  ['customTag', 'Tombstone Custom Tag', '', 'optional', 'Enter here...'],
  ['toggleMeta', 'Toggle Meta', [], 'optional', 'Enter here...', { asIn: true, props: { values: TOMBSTONE_TOGGLE_META } }],
  ['image', 'Tombstone Image', '', 'optional', '', { s3Upload: true }],
]);

export const HEADER_BASIC = FormHelper.generateMeta([
  ['heroVideoURL', 'Hero Video URL', '', 'optional', 'Enter here...'],
  ['toggleMeta', 'Toggle Meta', [], 'optional', 'Enter here...', { asIn: true, props: { values: HEADER_TOGGLE_META } }],
  ['heroImage', 'Hero Image', '', 'optional', '', { s3Upload: true }],
  ['heroBackgroundImage', 'Hero Background Image', '', 'optional', '', { s3Upload: true }],
]);

export const OFFERING_CONTENT = {
  content: [{
    title: {
      label: 'Title',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: 'e.g. Investment Term',
    },
    order: {
      label: 'Order',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: 'e.g. 1',
    },
    scope: {
      label: 'Scope',
      value: '',
      error: undefined,
      rule: 'optional',
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
      rule: 'optional',
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
        { key: 'multiple', value: 'multiple', text: 'Multiple' },
        { key: 'Max Offering Amount CF', value: 'maxOfferingAmountCF', text: 'Max Offering Amount CF' },
        { key: 'Max Offering Amount 506', value: 'maxOfferingAmount506', text: 'Max Offering Amount 506' },
        { key: 'Max Offering Amount 506C', value: 'maxOfferingAmount506C', text: 'Max Offering Amount 506C' },
        { key: 'Min Offering Amount CF', value: 'minOfferingAmountCF', text: 'Min Offering Amount CF' },
        { key: 'Min Offering Amount 506', value: 'minOfferingAmount506', text: 'Min Offering Amount 506' },
        { key: 'Min Offering Amount 506C', value: 'minOfferingAmount506C', text: 'Min Offering Amount 506C' },
        { key: 'Security', value: 'securities', text: 'Security' },
        { key: 'Total Round Size', value: 'totalRoundSize', text: 'Total Round Size' },
        { key: 'Preferred Return', value: 'preferredReturn', text: 'Preferred Return' },
        { key: 'Offering Size', value: 'offeringSize', text: 'Offering Size' },
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
  }],
};
