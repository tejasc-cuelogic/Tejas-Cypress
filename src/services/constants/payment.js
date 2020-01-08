import { FormHelper } from '../../helper';

export const PAYMENT = FormHelper.generateMeta([
  ['shorthandBusinessName', 'Short Hand Business Name', '', 'required', 'Short Hand Business Name', { props: { objRef: 'offering.keyTerms', skipField: true }, asIn: true }],
  ['securities', 'Securities', '', 'required|string', 'Choose here', { props: { objRef: 'offering.keyTerms', skipField: true }, asIn: true }],
  ['hardCloseDate', 'Hard Close Date', '', 'date', 'Hard Close Date', { customErrors: { date: 'Target Hard Close Date is not a valid date format.' }, props: { objRef: 'offering.closureSummary', skipField: true }, asIn: true }],
  ['maturityDate', 'Maturity Date', '', 'date', 'Maturity Date', { customErrors: { date: 'Target Maturity Date is not a valid date format.' }, props: { objRef: 'offering.closureSummary.keyTerms', skipField: true }, asIn: true }],
  ['expectedOpsDate', 'Expected Operations Date', '', 'date', 'Expected Operations Date', { customErrors: { date: 'Target Expected Operations Date is not a valid date format.' }, props: { objRef: 'offering.offering.launch' }, asIn: true }],
  ['expectedPaymentDate', 'Expected Payment Date', '', 'date', 'Expected Payment Date', { customErrors: { date: 'Target Expected Payment Date is not a valid date format.' }, props: { objRef: 'offering.closureSummary.keyTerms' }, asIn: true }],
  ['firstPaymentDate', 'First Payment Date', '', 'date', 'First Payment Date', { customErrors: { date: 'Target First Payment Date is not a valid date format.' }, props: { objRef: 'offering.closureSummary.repayment' }, asIn: true }],
  ['operationsDate', 'Operations Date', '', 'date', 'Operations Date', { customErrors: { date: 'Target Operations Date is not a valid date format.' }, props: { objRef: 'offering.closureSummary' }, asIn: true }],
  ['monthlyPayment', 'Monthly Payment', 0, '', 'Monthly Payment', { customErrors: { date: 'Monthly Payment is not a valid amount.' }, props: { objRef: 'offering.closureSummary.keyTerms' }, asIn: true }],
  ['sinkingFundBalance', 'Sinking Fund Balance', 0, 'required', '', { customErrors: { required: 'required' }, props: { objRef: '', skipField: true }, asIn: true }],
]);
