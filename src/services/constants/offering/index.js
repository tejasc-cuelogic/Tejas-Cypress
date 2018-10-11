export const UPDATES = {
  title: {
    value: '', label: 'Title', error: undefined, rule: 'required',
  },
  content: {
    value: '', label: 'description', error: undefined, rule: 'required',
  },
  lastUpdate: {
    value: '', label: 'lastUpdate', error: undefined, rule: 'optional',
  },
  status: {
    value: 'PENDING', label: 'Status', error: undefined, rule: 'required',
  },
};

export const OFFERING_STAGE = {
  CREATION: 'CREATION',
  LIVE: 'LIVE',
  CLOSE: 'CLOSE',
  ENGAGEMENT: 'ENGAGEMENT',
  COMPLETE: 'COMPLETE',
  FAILED: 'FAILED',
  TERMINATED: 'TERMINATED',
};
