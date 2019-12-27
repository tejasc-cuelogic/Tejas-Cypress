import { FormHelper } from '../../../../helper';

export const TOMBSTONE_BASIC = FormHelper.generateMeta([
  ['tombstoneDescription', 'Tombstone Description', '', 'optional', 'Describe your project and what you`re raising funds to accomplish.'],
  ['tombstoneImage', 'Tombstone Image', '', 'optional', '', { s3Upload: true }],
]);

export const TOMBSTONE_META = {
  tombstoneMeta: [{
    rowKey: {
      label: 'Key Name',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: 'e.g. Multiple',
    },
    rowType: {
      label: 'Row Type',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: 'e.g. mapped',
      options: [
        { key: 'mapped', value: 'mapped', text: 'Mapped' },
        { key: 'custome', value: 'custom', text: 'Custom' },
      ],
    },
    custom: {
      label: 'Custom Value',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: 'Enter here',
    },
    mapped: {
      label: 'Mapped Key',
      value: '',
      error: undefined,
      rule: 'optional',
      options: [
        { key: 'multiple', value: 'multiple', text: 'Multiple' },
        { key: 'Max Offering Amount', value: 'maxOfferingAmount', text: 'Max Offering Amount' },
      ],
      placeHolder: 'Enter here',
    },
    readOnly: {
      value: false,
      values: [
        {
          label: 'Read Only',
          value: 'TRUE',
        },
      ],
      error: undefined,
      rule: 'optional',
      placeHolder: '',
    },
    isVisible: {
      value: false,
      values: [
        {
          label: 'Is Visible',
          value: 'TRUE',
        },
      ],
      error: undefined,
      rule: 'optional',
      placeHolder: '',
    },
  }],
};
