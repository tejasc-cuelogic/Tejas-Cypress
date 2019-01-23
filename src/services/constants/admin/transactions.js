
export const STATUS = {
  'status-1': ['PENDING'],
  'status-2': ['PROCESSING'],
  'status-3': ['COMPLETE'],
  'status-4': ['FAILED', 'VOIDED'],
};


export const TAB_WISE_STATUS = {
  'status-1': 'PENDING',
  'status-2': 'PROCESSING',
  'status-3': 'COMPLETE',
  'status-4': 'FAILED',
};

export const STATUS_MAPPING = [
  {
    title: 'Request Date',
    field: 'startDate',
    refStatus: ['PENDING', 'PROCESSING', 'COMPLETE', 'FAILED'],
  },
  {
    title: 'User',
    field: 'userName',
    fieldLocation: 'userInfo.info',
    refStatus: ['PENDING', 'FAILED'],
  },
  {
    title: 'User ID',
    field: 'userId',
    fieldLocation: 'userInfo.id',
    refStatus: ['COMPLETE', 'PROCESSING'],
  },
  {
    title: 'NS Transaction ID',
    field: 'requestId',
    refStatus: ['PROCESSING', 'COMPLETE', 'FAILED'],
  },
  {
    title: 'GS Transaction ID',
    field: 'gsTransactionId',
    refStatus: ['PENDING', 'PROCESSING', 'COMPLETE', 'FAILED'],
  },
  {
    title: 'Type',
    field: 'type',
    refStatus: ['PENDING', 'PROCESSING', 'COMPLETE', 'FAILED'],
  },
  {
    title: 'CP Account ID',
    field: 'cpAccountId',
    refStatus: ['PENDING', 'PROCESSING', 'COMPLETE', 'FAILED'],
  },
  {
    title: 'Account ID',
    field: 'accountId',
    refStatus: ['PENDING'],
  },
  {
    title: 'Amount',
    field: 'amount',
    refStatus: ['PENDING', 'PROCESSING', 'COMPLETE', 'FAILED'],
  },
  {
    title: 'Available Date',
    field: 'estDateAvailable',
    refStatus: ['PROCESSING', 'COMPLETE'],
  },
  {
    title: 'Auto Draft',
    field: 'agreements',
    fieldLocation: 'agreement.agreementId',
    refStatus: ['PROCESSING', 'COMPLETE'],
  },
  {
    title: 'GS Status',
    field: 'gsStatus',
    refStatus: ['COMPLETE'],
  },
  {
    title: 'Failed Date',
    field: 'failDate',
    refStatus: ['FAILED'],
  },
  {
    title: 'Failed Reason',
    field: 'failDesc',
    refStatus: ['FAILED'],
  },
];

export const TRANSACTION_FAILURE = {
  justifyDescription: {
    value: '',
    label: 'Justify your decision',
    error: undefined,
    rule: 'required',
    placeHolder: 'Type your comment here...',
  },
};

