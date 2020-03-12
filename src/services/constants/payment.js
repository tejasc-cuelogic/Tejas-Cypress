import moment from 'moment';
import { FormHelper } from '../../helper';

export const PAYMENT = FormHelper.generateMeta([
  ['payments', 'Payments Contact Emails', '', '', 'Payments Contact Emails', { props: { objRef: 'offering.contact' }, asIn: true }],
  ['shorthandBusinessName', 'Short Hand Business Name', '', 'required', 'Short Hand Business Name', { props: { objRef: 'offering.keyTerms', skipField: true }, asIn: true }],
  ['securities', 'Securities', '', '', 'Choose here', { props: { objRef: 'offering.keyTerms', skipField: true }, asIn: true }],
  ['hardCloseDate', 'Hard Close Date', '', '', 'Hard Close Date', { props: { objRef: 'offering.closureSummary', skipField: true }, asIn: true }],
  ['maturityDate', 'Maturity Date', '', '', 'Maturity Date', { props: { objRef: 'offering.closureSummary.keyTerms', skipField: true }, asIn: true }],
  ['expectedOpsDate', 'Expected Operations Date', '', 'date', 'Expected Operations Date', { customErrors: { date: 'Target Expected Operations Date is not a valid date format.' }, props: { objRef: 'offering.offering.launch' }, asIn: true }],
  ['expectedPaymentDate', 'Expected Payment Date', '', 'date', 'Expected Payment Date', { customErrors: { date: 'Target Expected Payment Date is not a valid date format.' }, props: { objRef: 'offering.closureSummary.keyTerms' }, asIn: true }],
  ['firstPaymentDate', 'First Payment Date', '', 'date', 'First Payment Date', { customErrors: { date: 'Target First Payment Date is not a valid date format.' }, props: { objRef: 'offering.closureSummary.repayment' }, asIn: true }],
  ['operationsDate', 'Operations Date', '', 'date', 'Operations Date', { customErrors: { date: 'Target Operations Date is not a valid date format.' }, props: { objRef: 'offering.closureSummary' }, asIn: true }],
  ['monthlyPayment', 'Monthly Payment', '', '', 'Monthly Payment', { props: { objRef: 'offering.closureSummary.keyTerms' }, asIn: true }],
  ['amountDue', 'Amount Due', '', '', 'Amount Due', { props: { objRef: 'offering.payment' }, asIn: true }],
  ['anticipatedOpenDate', 'Anticipated Opening Date', '', 'date', 'Anticipated Opening Date', { customErrors: { date: 'Anticipated Opening Date is not a valid date format.' }, props: { objRef: 'offering.closureSummary' }, asIn: true }],
  ['draftDate', 'Draft Date', '', '', 'Draft Date', { props: { objRef: 'offering.payment' }, asIn: true }],
  ['draftDay', 'Draft Day', '', '', 'Draft Day', { props: { skipField: true, objRef: 'offering.payment' }, asIn: true }],
  ['paymentStartDateCalc', 'Payment Start Date', '', '', 'Payment Start Date', { props: { objRef: 'offering.payment' }, asIn: true }],
  ['minPaymentStartDateCalc', 'Min Payment Start Date', '', '', 'Min Payment Start Date', { props: { objRef: 'offering.payment' }, asIn: true }],
  ['startupPeriod', 'Startup Period', '', '', 'Startup Period', { props: { objRef: 'offering.closureSummary' }, asIn: true }],
  ['inDefault', 'In Default', false, '', 'In Default',
  { props: { values: [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ],
  objRef: 'offering.payment' },
  asIn: true },
  ],
  ['sendNotification', 'Notifications', false, '', 'Notifications',
  { props: { values: [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ],
  objRef: 'offering.payment' },
  asIn: true },
  ],
  ['sinkingFundBalance', 'Sinking Fund Balance', 0, '', '', { props: { objRef: '', skipField: true }, asIn: true }],
]);

export const ACTION = FormHelper.generateMeta([
  ['date', 'Date', moment().format('MM-DD-YYYY'), 'required|date', 'MM-DD-YYYY', { props: { defaultValue: moment().format('MM-DD-YYYY') }, customErrors: { date: 'Date is not a valid date format.' }, asIn: true }],
  ['scope', 'Scope', '', '', 'e.g ISSUER'],
  ['sendEmail', 'Send Email', false, '', 'Send Email',
  { props: { values: [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ] },
  asIn: true },
  ],
]);
