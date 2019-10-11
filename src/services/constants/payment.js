import { FormHelper } from '../../helper';

export const PAYMENT = FormHelper.generateMeta([
  ['shorthandBusinessName', 'Short Hand Business Name', '', 'required', 'Short Hand Business Name'],
  ['securities', 'Securities', '', 'required|string', 'Choose here'],
  ['hardCloseDate', 'Hard Close Date', '', 'required|date', 'Hard Close Date', { customErrors: { date: 'Target Hard Close Date is not a valid date format.' } }],
  ['maturityDate', 'Maturity Date', '', 'required|date', 'Maturity Date', { customErrors: { date: 'Target Maturity Date is not a valid date format.' } }],
  ['expectedOpsDate', 'Expected Operations Date', '', 'required|date', 'Expected Operations Date', { customErrors: { date: 'Target Expected Operations Date is not a valid date format.' } }],
  ['expectedPaymentDate', 'Expected Payment Date', '', 'required|date', 'Expected Payment Date', { customErrors: { date: 'Target Expected Payment Date is not a valid date format.' } }],
  ['firstPaymentDate', 'First Payment Date', '', 'required|date', 'First Payment Date', { customErrors: { date: 'Target First Payment Date is not a valid date format.' } }],
  ['operationsDate', 'Operations Date', '', 'required|date', 'Operations Date', { customErrors: { date: 'Target Operations Date is not a valid date format.' } }],
  ['sinkingFundBalance', 'Sinking Fund Balance', 0, 'required', '', { customErrors: { required: 'required' } }],
]);
