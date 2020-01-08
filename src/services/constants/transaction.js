import { COMMON } from './auth';

export const TRANSFER_FUND = {
  amount: {
    value: '',
    label: 'Amount',
    error: undefined,
    placeHolder: 'Enter amount',
    rule: 'required|numeric',
  },
};

export const ADD_WITHDRAW_FUND = {
  amount: TRANSFER_FUND.amount,
  description: {
    value: '',
    label: 'Justify',
    error: undefined,
    rule: 'optional',
    placeHolder: 'Type your comment here...',
  },
  showAgreementId: {
    value: false,
    rule: 'optional',
    skipField: true,
  },
  agreementId: {
    value: '',
    label: 'Agreement ID',
    error: undefined,
    placeHolder: 'Enter Agreement ID',
    rule: 'optional',
  },
  sendInvestorNotification: {
    value: false,
    label: 'Send Notification to Investor',
    error: undefined,
    rule: 'optional',
  },
};

export const VERIFY_OTP = {
  code: { ...COMMON.code },
};
