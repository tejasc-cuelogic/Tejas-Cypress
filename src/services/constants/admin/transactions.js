
export const STATUS_MAPPING = {
  // eslint-disable-next-line max-len
  // 'pre-pending': { status: ['PRE_PENDING'], affirmativeCta: { action: 'Approved', title: 'Approve' }, failedCta: { action: 'Declined', title: 'Decline' } },
  pending: {
    status: ['PENDING', 'PRE_PENDING'], affirmativeCta: { action: 'Approved', title: 'Approve' }, failedCta: { action: 'Declined', title: 'Decline' }, syncCta: { action: 'Sync', title: 'Sync' },
  },
  processing: { status: ['PROCESSING'], affirmativeCta: { action: 'Verified', title: 'Verified' }, failedCta: { action: 'Failed', title: 'Failed' } },
  complete: { status: ['COMPLETE'] },
  failed: { status: ['FAILED', 'VOIDED'] },
};

export const COUNT_STATUS_MAPPING = {
  prePendingCount: 'pending',
  pendingCount: 'pending',
  processingCount: 'processing',
  completedCount: 'complete',
  failedCount: 'failed',
  voidCount: 'failed',
};

export const STATUS_META = [
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
    title: 'Account Type',
    field: 'accountType',
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
    field: 'autodraft',
    refStatus: ['PENDING', 'PROCESSING', 'COMPLETE'],
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
    rule: 'required|max:250',
    placeHolder: 'Type your comment here...',
    customErrors: {
      max: 'Description cannot be greater than 250 characters.',
    },
  },
};

export const FILTER_META = {
  transactionType: [
    { text: 'Select Type', key: '', value: '' },
    { text: 'Withdrawal', key: 'Withdrawal', value: 'WITHDRAWAL' },
    { text: 'Deposit', key: 'Deposit', value: 'DEPOSIT' },
  ],
};
