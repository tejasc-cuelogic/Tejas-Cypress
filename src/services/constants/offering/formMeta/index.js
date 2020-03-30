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

export const INVEST_NOW_TOC_TEMPLATE = FormHelper.generateMeta([
  ['template', 'Template', 1, 'required', 'Template', { props: {
    options: [
      { key: 'Static', value: 1, text: 'Static' },
      { key: 'NS-Default', value: 3, text: 'NS-Default' },
      { key: 'Dynamic', value: 2, text: 'Dynamic' },
    ],
    defaultValue: 1,
  },
  asIn: true }],
]);

export const INVEST_NOW_PAGE = FormHelper.generateMeta([
  ['title', 'Description (optional)', '', 'optional', 'Description (optional)'],
  // ['page', 'Page no.', '', 'optional', 'Page no.'],
  // ['regulation', 'Regulation', '', 'required', 'Regulation', { props: {
  //   options: REGULATION_VALUES,
  // },
  // asIn: true }],
]);
