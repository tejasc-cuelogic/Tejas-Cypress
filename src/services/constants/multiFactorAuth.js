export const MFA_MODE_TYPES = {
  mfaModeTypes: {
    value: '',
    values: [
      {
        label: 'Phone number',
        value: 'PHONE',
      },
      {
        label: 'E-mail address',
        value: 'EMAIL',
      },
    ],
    error: undefined,
    rule: 'required',
  },
  mfaPhoneModeTypes: {
    value: '',
    values: [
      {
        label: 'Text',
        value: 'TEXT',
      },
      {
        label: 'Call',
        value: 'CALL',
      },
    ],
    error: undefined,
    rule: 'required_if:mfaModeTypes,PHONE',
  },
};
