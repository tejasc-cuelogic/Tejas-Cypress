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
  ['title', 'Page Description', '', 'optional', 'Page Description'],
  // ['page', 'Page no.', '', 'optional', 'Page no.'],
  // ['regulation', 'Regulation', '', 'required', 'Regulation', { props: {
  //   options: REGULATION_VALUES,
  // },
  // asIn: true }],
]);
