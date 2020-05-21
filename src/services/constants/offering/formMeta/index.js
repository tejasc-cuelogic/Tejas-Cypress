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
      rule: 'required',
      customErrors: { required: 'mapping key is required.' },
      placeHolder: '',
    },
    value: {
      label: 'Type',
      value: '',
      error: undefined,
      rule: 'required',
      customErrors: { required: 'mapping type is required.' },
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

const CONFIG_TOGGLE_META = [
  { label: 'Show Expected Return', value: 'EXPECTED_RETURN' },
  { label: 'Show Bonus Rewards', value: 'BONUS_REWARDS' },
];

const EXPECTED_RETURN_TYPE = [
  { key: 'Term Note Calculation', value: 'TERM_NOTE_CALCULATION', text: 'Term Note Calculation' },
  { key: 'Rev Share Calculation', value: 'REV_SHAR_CALCULATION', text: 'Rev Share Calculation' },
];

export const INVEST_NOW_CONFIG_META = FormHelper.generateMeta([
  ['investmentType', 'Investment Type', 'DOLLARS', 'required', 'Investment Type', { props: {
    values: [{ label: 'DOLLARS', value: 'DOLLARS' }, { label: 'UNITS', value: 'UNITS' }],
    defaultValue: 'DOLLARS',
  },
  asIn: true }],
  ['toggleMeta', 'Toggle Meta', [], 'optional', 'Enter here...', { asIn: true, props: { defaultValue: [], values: CONFIG_TOGGLE_META } }],
  ['expectedReturnCalc', 'Expected Return Type', 'TERM_NOTE_CALCULATION', 'required', 'Investment Type', { props: {
    options: EXPECTED_RETURN_TYPE,
    defaultValue: 'TERM_NOTE_CALCULATION',
  },
  asIn: true }],
]);
