export const MFA_MODE_TYPES = {
  mfaModeTypes: {
    value: 0,
    values: [
      {
        label: 'Phone number',
        value: 0,
      },
      {
        label: 'E-mail address',
        value: 1,
      },
    ],
    error: undefined,
    rule: 'required',
  },
  mfaPhoneModeTypes: {
    value: 0,
    values: [
      {
        label: 'Text',
        value: 0,
      },
      {
        label: 'Call',
        value: 1,
      },
    ],
    error: undefined,
    rule: 'required',
  },
};
