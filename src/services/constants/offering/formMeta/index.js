// import { FormHelper } from '../../../../helper';
import { REGULATION_VALUES } from '../../admin/offerings';

export const INVEST_NOW_TOC = {
  page: {
    label: 'Page',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'e.g. 1',
  },
  title: {
    label: 'Page Title',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'e.g. Enter here',
  },
  regulation: {
    label: 'Regulation',
    value: '',
    error: undefined,
    rule: 'required',
    options: REGULATION_VALUES,
    placeHolder: 'Enter here',
  },
  toc: [{
    label: {
      label: 'Label',
      value: '',
      error: undefined,
      rule: 'required',
      placeHolder: 'e.g. Investment Term',
    },
    order: {
      label: 'Order',
      value: '',
      error: undefined,
      rule: 'optional',
      placeHolder: 'e.g. 1',
    },
    account: {
      label: 'Account',
      value: '',
      error: undefined,
      rule: 'required',
      options: [
        { key: 'ALL', value: 'ALL', text: 'All' },
        { key: 'INDIVIDUAL_IRA', value: 'INDIVIDUAL', text: 'Individual & IRA' },
        { key: 'ENTITY', value: 'ENTITY', text: 'Entity' },
      ],
      placeHolder: 'Enter here',
    },
    required: {
      label: 'Required',
      value: true,
      defaultValue: true,
      values: [{ label: 'Yes', value: true }, { label: 'No', value: false }],
      error: undefined,
      rule: 'optional',
      placeHolder: 'e.g. Custom Value',
    },
  }],
};
