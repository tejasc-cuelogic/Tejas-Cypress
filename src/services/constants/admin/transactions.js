
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

export const FAILED_STATUS = {
  'status-1': 'Declined',
  'status-2': 'Failed',
};

export const COUNT_STATUS_MAPPING = {
  pendingCount: 'status-1',
  processingCount: 'status-2',
  completedCount: 'status-3',
  failedCount: 'status-4',
  voidCount: 'status-4',
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
    fieldId: 'userInfo.id',
    fieldLocation: 'userInfo.info',
    refStatus: ['PENDING', 'FAILED', 'COMPLETE', 'PROCESSING'],
  },
  {
    title: 'NS Transaction ID',
    field: 'requestId',
    refStatus: ['COMPLETE', 'FAILED'],
  },
  {
    title: 'Transfer ID',
    field: 'requestId',
    refStatus: ['PENDING', 'PROCESSING'],
  },
  {
    title: 'GS Transaction ID',
    field: 'gstransactionId',
    refStatus: ['PROCESSING', 'COMPLETE', 'FAILED'],
  },
  {
    title: 'Type',
    field: 'direction',
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

