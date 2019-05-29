export const MFA_MODE_TYPES = {
  mfaModeTypes: {
    value: 'TEXT',
    values: [
      {
        label: 'Text message',
        value: 'TEXT',
      },
      {
        label: 'Phone call',
        value: 'CALL',
      },
      {
        label: 'Email',
        value: 'EMAIL',
      },
    ],
    error: undefined,
    rule: 'required',
  },
  mfaPhoneModeTypes: {
    value: 'TEXT',
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
