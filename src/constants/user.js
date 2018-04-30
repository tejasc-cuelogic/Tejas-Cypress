export const USER_ROLES = ['admin', 'bowner', 'investor'];
export const USER_TYPES_META = [
  {
    key: 'i', text: 'Investor', value: 'investor', desc: 'Apply for funding with your business',
  },
  {
    key: 'o', text: 'Business Owner', value: 'bowner', desc: 'Invest in existing businesses and get revenue',
  },
];

export const USER_LIST_META = [
  ['profilepic', '', false],
  ['firstName', 'Full Name', false],
  ['city', 'Residence City', false],
  ['number', 'Phone Number', false],
  ['accountType', 'Account Types', false],
  ['createdDate', 'Account Creation', true],
  ['lastLoginDate', 'Last Login', true],
  ['actions', '', false],
];

export const USER_DETAIL_SECTIONS = ['Profile', 'Limits', 'Beneficiaries', 'Portfolio', 'Transactions', 'Statements', 'Bonus rewards', 'Messages'];

// Filters
export const FILTER_META = {
  accountType: [
    { text: 'Admin', value: 'admin' },
    { text: 'Business', value: 'bowner' },
    { text: 'IRA', value: 'ira' },
    { text: 'Individual', value: 'individual' },
    { text: 'Entity', value: 'entity' },
  ],
  accountStatus: [
    { text: 'Unlocked', value: 'unlocked' },
    { text: 'Locked', value: 'locked' },
  ],
  accreditation: [
    { text: 'Accridiated', value: 'yes' },
    { text: 'Non-Accridiated', value: 'no' },
  ],
  city: [
    { text: 'Greenfields', value: 'greenfields' },
    { text: 'Bartley', value: 'bartley' },
  ],
};
/* eslint-disable */
export const USER_POOL = {"id":"5acc7be47498ac534eed4f84","email":"pickettbryan@securia.com","firstName":"Ada","lastName":"Mccullough","createdDate":"2015-03-07T06:02:12 -06:-30","updatedDate":"2018-01-16T01:47:07 -06:-30","legalDetails":{"verificationStartDate":"2014-01-07T04:21:39 -06:-30","verificationCompletionDate":"2014-05-14T12:34:12 -06:-30","legalName":{"firstLegalName":"Tanner","lastLegalName":"Guerra"},"dateOfBirth":"02-03-1980","ssn":"145-47-8825","legalAddress":{"street1":"Willow Street","street2":"Coles Street","city":"Lisco","state":"Connecticut","zipCode":2103}},"contactDetails":{"email":{"email":"tannerguerra@securia.com","verificationDate":"2017-11-29T11:46:08 -06:-30"},"phone":{"number":"+1 (871) 523-3343"}}};

export const RANDOM_USER = () => {
  return USER_POOL;
}
