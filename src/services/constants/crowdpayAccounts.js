export const CROWDPAY_FILTERS = {
  review: { initialStatus: ['FULL', 'DECLINED'], initialFilters: ['FULL'], accountType: [] },
  cip: { initialStatus: ['CIP_PROCESSING', 'GS_PROCESSING', 'DECLINED'], initialFilters: ['CIP_PROCESSING'], accountType: ['INDIVIDUAL'] },
  ira: { initialStatus: ['GS_PROCESSING', 'NS_PROCESSING', 'DECLINED'], initialFilters: ['NS_PROCESSING'], accountType: ['IRA'] },
  entity: { initialStatus: ['GS_PROCESSING', 'NS_PROCESSING', 'DECLINED'], initialFilters: ['NS_PROCESSING'], accountType: ['ENTITY'] },
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
    value: ['CIP_PROCESSING'],
    values: [
      { label: 'CIP Processing', value: 'CIP_PROCESSING' },
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
