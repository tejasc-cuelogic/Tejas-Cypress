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

export const VERIFY_OTP = {
  code: { ...COMMON.code },
};
