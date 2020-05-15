import { FormHelper } from '../../../../helper';
// import { REGULATION_VALUES } from '../../admin/offerings';

export const INVEST_NOW_TOC = FormHelper.generateMeta([
  ['label', 'Label', '', 'required', 'Label'],
  ['order', 'Order', '', 'optional', 'Order'],
  ['account', 'Account', '', 'required', 'Account', { props: {
    options: [
      { key: 'ALL', value: 'ALL', text: 'All' },
      { key: 'INDIVIDUAL_IRA', value: 'INDIVIDUAL', text: 'Individual & IRA' },
      { key: 'ENTITY', value: 'ENTITY', text: 'Entity' },
    ],
  },
  asIn: true }],
  ['required', 'Required', true, 'required', 'Required', { props: {
    values: [{ label: 'Yes', value: true }, { label: 'No', value: false }],
    defaultValue: true,
  },
  asIn: true }],
]);

export const INVEST_NOW_PAGE = FormHelper.generateMeta([
  ['title', 'Description (Copy on the InvestNow UI)', '', 'optional', 'Description (Copy on the InvestNow UI)'],
  ['note', 'Note (Additional Notes about this TOC)', '', 'optional', 'Note (Additional Notes about this TOC)'],
  ['hideHeader', 'Hide Header', [], 'optional', '', { props: {
    values: [
      {
        label: 'Hide Header',
        value: true,
      },
    ],
    defaultValue: [],
  },
  asIn: true }],
  // ['page', 'Page no.', '', 'optional', 'Page no.'],
  // ['regulation', 'Regulation', '', 'required', 'Regulation', { props: {
  //   options: REGULATION_VALUES,
  // },
  // asIn: true }],
]);

// export const DOCUMENT_MAPPING = FormHelper.generateMeta([
//   ['key', 'Key', '', 'optional', 'Enter Here'],
//   ['type', 'Type', '', 'required', '',
//    {
//     asIn: true,
//     props: {
//       values: [],
//     },
//   },
//  ],
// ]);

export const DOCUMENT_MAPPING = {
  mapping: [{
    key: {
      label: 'Key',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: '',
    },
    value: {
      label: 'Type',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: '',
      options: [],
      asField: true,
    },
    customValue: {
      label: 'Custom Value',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: '',
    },
  }],
};
