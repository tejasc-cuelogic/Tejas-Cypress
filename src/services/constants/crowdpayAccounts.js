export const ACCOUNT_STATUS_VALUES = {
  review: ['FULL', 'DECLINED'],
  cip: ['GS_PROCESSING', 'DECLINED'],
  ira: ['GS_PROCESSING', 'NS_PROCESSING', 'DECLINED'],
  entity: ['GS_PROCESSING', 'NS_PROCESSING', 'DECLINED'],
};

export const ACCOUNT_STATUS_FILTER_VALUES = {
  review: ['FULL'],
  cip: ['GS_PROCESSING'],
  ira: ['NS_PROCESSING'],
  entity: ['NS_PROCESSING'],
};

export const FILTER_META = {
  review: {
    value: [],
    values: [
      { label: 'Declined', value: 'DECLINED' },
    ],
    error: undefined,
    rule: 'array',
  },
  cip: {
    value: ['GS_PROCESSING'],
    values: [
      { label: 'GS Processing', value: 'GS_PROCESSING' },
      { label: 'Declined', value: 'DECLINED' },
    ],
    error: undefined,
    rule: 'array',
  },
  ira: {
    value: ['NS_PROCESSING'],
    values: [
      { label: 'NS Processing', value: 'NS_PROCESSING' },
      { label: 'GS Processing', value: 'GS_PROCESSING' },
      { label: 'Declined', value: 'DECLINED' },
    ],
    error: undefined,
    rule: 'array',
  },
  entity: {
    value: ['NS_PROCESSING'],
    values: [
      { label: 'NS Processing', value: 'NS_PROCESSING' },
      { label: 'GS Processing', value: 'GS_PROCESSING' },
      { label: 'Declined', value: 'DECLINED' },
    ],
    error: undefined,
    rule: 'array',
  },
};

export const CROWDPAY_ACCOUNTS_STATUS = {
  PARTIAL: 'PARTIAL',
  FULL: 'FULL',
  FROZEN: 'FROZEN',
  CIP_PROCESSING: 'CIP_PROCESSING',
  NS_PROCESSING: 'NS_PROCESSING',
  GS_PROCESSING: 'GS_PROCESSING',
  DECLINED: 'DECLINED',
  DELETED: 'DELETED',
};
