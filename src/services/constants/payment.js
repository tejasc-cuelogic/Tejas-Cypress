import { FormHelper } from '../../helper';

export const PAYMENT = FormHelper.generateMeta([
  ['shorthandBusinessName', 'Short Hand Business Name', '', 'required', 'Short Hand Business Name', { props: { objRef: 'offering.keyTerms', skipField: true }, asIn: true }],
  ['securities', 'Securities', '', 'required|string', 'Choose here', { props: { objRef: 'offering.keyTerms', skipField: true }, asIn: true }],
  ['hardCloseDate', 'Hard Close Date', '', 'required|date', 'Hard Close Date', { customErrors: { date: 'Target Hard Close Date is not a valid date format.' }, props: { objRef: 'offering.closureSummary', skipField: true }, asIn: true }],
  ['maturityDate', 'Maturity Date', '', 'required|date', 'Maturity Date', { customErrors: { date: 'Target Maturity Date is not a valid date format.' }, props: { objRef: 'offering.closureSummary.keyTerms', skipField: true }, asIn: true }],
  ['expectedOpsDate', 'Expected Operations Date', '', 'required|date', 'Expected Operations Date', { customErrors: { date: 'Target Expected Operations Date is not a valid date format.' }, props: { objRef: 'offering.offering.launch' }, asIn: true }],
  ['expectedPaymentDate', 'Expected Payment Date', '', 'required|date', 'Expected Payment Date', { customErrors: { date: 'Target Expected Payment Date is not a valid date format.' }, props: { objRef: 'offering.closureSummary.keyTerms' }, asIn: true }],
  ['firstPaymentDate', 'First Payment Date', '', 'required|date', 'First Payment Date', { customErrors: { date: 'Target First Payment Date is not a valid date format.' }, props: { objRef: 'offering.closureSummary.repayment' }, asIn: true }],
  ['operationsDate', 'Operations Date', '', 'required|date', 'Operations Date', { customErrors: { date: 'Target Operations Date is not a valid date format.' }, props: { objRef: 'offering.closureSummary' }, asIn: true }],
  ['sinkingFundBalance', 'Sinking Fund Balance', 0, 'required', '', { customErrors: { required: 'required' }, props: { objRef: '', skipField: true }, asIn: true }],
]);
