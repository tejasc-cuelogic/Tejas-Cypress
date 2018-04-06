export const USER_ROLES = ['admin', 'bowner', 'investor'];
export const USER_TYPES_META = [
  {
    key: 'i', text: 'Investor', value: 'investor', desc: 'Apply for funding with your business',
  },
  {
    key: 'o', text: 'Business Owner', value: 'bowner', desc: 'Invest in existing businesses and get revenue',
  },
];

// Filters
export const AccountType = [{ text: 'Admin', value: 'Admin' }, { text: 'Business', value: 'Business' }, { text: 'IRA', value: 'IRA' }, { text: 'Individual', value: 'Individual' }, { text: 'Entity', value: 'Entity' }];

export const Status = [{ text: 'Unlocked', value: 'Unlocked' }, { text: 'Locked', value: 'Locked' }];

export const Accridiation = [{ text: 'Accridiated', value: 'Accridiated' }, { text: 'Non-Accridiated', value: 'Non-Accridiated' }];

export const City = [{ text: 'Alabama', value: 'Alabama' }, { text: 'New York', value: 'New York' }];
