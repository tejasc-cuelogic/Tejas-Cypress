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

export const TOMBSTONE_BASIC = {
  ...FormHelper.generateMeta([
    ['title', 'Title', '', 'required', 'Enter Here'],
    ['bgColor', 'Background Color', '', 'optional', 'Enter Here'],
    ['description', 'Description', '', 'required', 'Describe your project and what you`re raising funds to accomplish.'],
    ['bgImage', 'BackGround Image', '', 'required', '', { s3Upload: true }],
    ['image', 'Featured Image', '', 'required', '', { s3Upload: true }],
    ['color', 'Tag Color', '', 'optional', 'Enter Here', { asIn: true, props: { objRefOutput: 'tag', objRef: 'tag' } }],
    ['text', 'Tag Text', '', 'optional', 'Enter Here', { asIn: true, props: { objRefOutput: 'tag', objRef: 'tag' } }],
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
        { key: 'ACTIVE_INVESTMENTS', value: 'ACTIVE_INVESTMENTS', text: 'Active Investments' },
        { key: 'COMPLETE_INVESTMENTS', value: 'COMPLETE_INVESTMENTS', text: 'Complete Investments' },
        { key: 'INSIGHTS', value: 'INSIGHTS', text: 'Insights' },
        { key: 'HEADER', value: 'HEADER', text: 'Header' },
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
