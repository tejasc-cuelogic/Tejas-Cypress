/* eslint-disable jsx-a11y/label-has-for */
import moment from 'moment';
import React from 'react';
import { Icon } from 'semantic-ui-react';
import Validator from 'validatorjs';
import Helper from '../helper/utility';

/* eslint-disable no-unused-vars, arrow-body-style */
Validator.register('taxId', (value, attribute) => {
  return value.toString().length === 9;
}, 'The :attribute is not in the format XX-XXXXXXX.');

Validator.register('minAcnum', (value, requirement, attribute) => {
  return value.toString().length > 3 && value.toString().length < 18;
}, 'The :attribute should be at least 4 digits and at most 17 digits');

export const PLAID_URL = process.env.REACT_APP_PLAID_URL;

export const PLAID_PUBLIC_KEY = process.env.REACT_APP_PLAID_PUBLIC_KEY;

export const PLAID_ENV = process.env.REACT_APP_PLAID_ENV;

export const INVESTMENT_ACCOUNT_TYPES = {
  0: 'individual',
  1: 'ira',
  2: 'entity',
};

export const US_STATES_FOR_INVESTOR = [
  { key: 'AL', value: 'Alabama', text: 'ALABAMA' },
  { key: 'AK', value: 'Alaska', text: 'ALASKA' },
  { key: 'AZ', value: 'Arizona', text: 'ARIZONA' },
  { key: 'AR', value: 'Arkansas', text: 'ARKANSAS' },
  { key: 'CA', value: 'California', text: 'CALIFORNIA' },
  { key: 'CO', value: 'Colorado', text: 'COLORADO' },
  { key: 'CT', value: 'Connecticut', text: 'CONNECTICUT' },
  { key: 'DE', value: 'DelaWare', text: 'DELAWARE' },
  { key: 'DC', value: 'District Of Columbia', text: 'DISTRICT OF COLUMBIA' },
  { key: 'FL', value: 'Florida', text: 'FLORIDA' },
  { key: 'GA', value: 'Georgia', text: 'GEORGIA' },
  { key: 'GU', value: 'Guam', text: 'GUAM' },
  { key: 'HI', value: 'Hawaii', text: 'HAWAII' },
  { key: 'ID', value: 'Idaho', text: 'IDAHO' },
  { key: 'IL', value: 'Illinois', text: 'ILLINOIS' },
  { key: 'IN', value: 'Indiana', text: 'INDIANA' },
  { key: 'IA', value: 'Iowa', text: 'IOWA' },
  { key: 'KS', value: 'Kansas', text: 'KANSAS' },
  { key: 'KY', value: 'Kentucky', text: 'KENTUCKY' },
  { key: 'LA', value: 'Louisiana', text: 'LOUISIANA' },
  { key: 'ME', value: 'Maine', text: 'MAINE' },
  { key: 'MD', value: 'Maryland', text: 'MARYLAND' },
  { key: 'MA', value: 'Massachusetts', text: 'MASSACHUSETTS' },
  { key: 'MI', value: 'Michigan', text: 'MICHIGAN' },
  { key: 'MN', value: 'Minnesota', text: 'MINNESOTA' },
  { key: 'MS', value: 'Mississippi', text: 'MISSISSIPPI' },
  { key: 'MO', value: 'Missouri', text: 'MISSOURI' },
  { key: 'MT', value: 'Montana', text: 'MONTANA' },
  { key: 'NE', value: 'Nebraska', text: 'NEBRASKA' },
  { key: 'NV', value: 'Nevada', text: 'NEVADA' },
  { key: 'NH', value: 'New Hampshire', text: 'NEW HAMPSHIRE' },
  { key: 'NJ', value: 'New Jersey', text: 'NEW JERSEY' },
  { key: 'NM', value: 'New Mexico', text: 'NEW MEXICO' },
  { key: 'NY', value: 'New York', text: 'NEW YORK' },
  { key: 'NC', value: 'North Carolina', text: 'NORTH CAROLINA' },
  { key: 'ND', value: 'North Dakota', text: 'NORTH DAKOTA' },
  { key: 'OH', value: 'Ohio', text: 'OHIO' },
  { key: 'OK', value: 'Oklahoma', text: 'OKLAHOMA' },
  { key: 'OR', value: 'Oregon', text: 'OREGON' },
  { key: 'PA', value: 'Pennsylvania', text: 'PENNSYLVANIA' },
  { key: 'PR', value: 'Puerto Rico', text: 'PUERTO RICO' },
  { key: 'RI', value: 'Rhode Island', text: 'RHODE ISLAND' },
  { key: 'SC', value: 'South Carolina', text: 'SOUTH CAROLINA' },
  { key: 'SD', value: 'South Dakota', text: 'SOUTH DAKOTA' },
  { key: 'TN', value: 'Tennessee', text: 'TENNESSEE' },
  { key: 'TX', value: 'Texas', text: 'TEXAS' },
  { key: 'UT', value: 'Utah', text: 'UTAH' },
  { key: 'VT', value: 'Vermont', text: 'VERMONT' },
  { key: 'VI', value: 'Virgin Islands, U.S.', text: 'VIRGIN ISLANDS, U.S.' },
  { key: 'VA', value: 'Virginia', text: 'VIRGINIA' },
  { key: 'WA', value: 'Washington', text: 'WASHINGTON' },
  { key: 'WV', value: 'West Virginia', text: 'WEST VIRGINIA' },
  { key: 'WI', value: 'Wisconsin', text: 'WISCONSIN' },
  { key: 'WY', value: 'Wyoming', text: 'WYOMING' },
  { key: 'B5', value: 'American Samoa', text: 'AMERICAN SAMOA' },
  { key: '1V', value: 'Northern Mariana Islands', text: 'NORTHERN MARIANA ISLANDS' },
];

export const US_STATES = [
  { key: 'AL', value: 'AL', text: 'ALABAMA' },
  { key: 'AK', value: 'AK', text: 'ALASKA' },
  { key: 'AZ', value: 'AZ', text: 'ARIZONA' },
  { key: 'AR', value: 'AR', text: 'ARKANSAS' },
  { key: 'CA', value: 'CA', text: 'CALIFORNIA' },
  { key: 'CO', value: 'CO', text: 'COLORADO' },
  { key: 'CT', value: 'CT', text: 'CONNECTICUT' },
  { key: 'DE', value: 'DE', text: 'DELAWARE' },
  { key: 'DC', value: 'DC', text: 'DISTRICT OF COLUMBIA' },
  { key: 'FL', value: 'FL', text: 'FLORIDA' },
  { key: 'GA', value: 'GA', text: 'GEORGIA' },
  { key: 'GU', value: 'GU', text: 'GUAM' },
  { key: 'HI', value: 'HI', text: 'HAWAII' },
  { key: 'ID', value: 'ID', text: 'IDAHO' },
  { key: 'IL', value: 'IL', text: 'ILLINOIS' },
  { key: 'IN', value: 'IN', text: 'INDIANA' },
  { key: 'IA', value: 'IA', text: 'IOWA' },
  { key: 'KS', value: 'KS', text: 'KANSAS' },
  { key: 'KY', value: 'KY', text: 'KENTUCKY' },
  { key: 'LA', value: 'LA', text: 'LOUISIANA' },
  { key: 'ME', value: 'ME', text: 'MAINE' },
  { key: 'MD', value: 'MD', text: 'MARYLAND' },
  { key: 'MA', value: 'MA', text: 'MASSACHUSETTS' },
  { key: 'MI', value: 'MI', text: 'MICHIGAN' },
  { key: 'MN', value: 'MN', text: 'MINNESOTA' },
  { key: 'MS', value: 'MS', text: 'MISSISSIPPI' },
  { key: 'MO', value: 'MO', text: 'MISSOURI' },
  { key: 'MT', value: 'MT', text: 'MONTANA' },
  { key: 'NE', value: 'NE', text: 'NEBRASKA' },
  { key: 'NV', value: 'NV', text: 'NEVADA' },
  { key: 'NH', value: 'NH', text: 'NEW HAMPSHIRE' },
  { key: 'NJ', value: 'NJ', text: 'NEW JERSEY' },
  { key: 'NM', value: 'NM', text: 'NEW MEXICO' },
  { key: 'NY', value: 'NY', text: 'NEW YORK' },
  { key: 'NC', value: 'NC', text: 'NORTH CAROLINA' },
  { key: 'ND', value: 'ND', text: 'NORTH DAKOTA' },
  { key: 'OH', value: 'OH', text: 'OHIO' },
  { key: 'OK', value: 'OK', text: 'OKLAHOMA' },
  { key: 'OR', value: 'OR', text: 'OREGON' },
  { key: 'PA', value: 'PA', text: 'PENNSYLVANIA' },
  { key: 'PR', value: 'PR', text: 'PUERTO RICO' },
  { key: 'RI', value: 'RI', text: 'RHODE ISLAND' },
  { key: 'SC', value: 'SC', text: 'SOUTH CAROLINA' },
  { key: 'SD', value: 'SD', text: 'SOUTH DAKOTA' },
  { key: 'TN', value: 'TN', text: 'TENNESSEE' },
  { key: 'TX', value: 'TX', text: 'TEXAS' },
  { key: 'UT', value: 'UT', text: 'UTAH' },
  { key: 'VT', value: 'VT', text: 'VERMONT' },
  { key: 'VI', value: 'VI', text: 'VIRGIN ISLANDS, U.S.' },
  { key: 'VA', value: 'VA', text: 'VIRGINIA' },
  { key: 'WA', value: 'WA', text: 'WASHINGTON' },
  { key: 'WV', value: 'WV', text: 'WEST VIRGINIA' },
  { key: 'WI', value: 'WI', text: 'WISCONSIN' },
  { key: 'WY', value: 'WY', text: 'WYOMING' },
  { key: 'B5', value: 'B5', text: 'AMERICAN SAMOA' },
  { key: '1V', value: '1V', text: 'NORTHERN MARIANA ISLANDS' },
];

export const FILE_UPLOAD_STEPS = {
  photoId: 'PROFILE_CIP_LICENSE',
  proofOfResidence: 'PROFILE_CIP_RESIDENCE',
  identityDoc: 'ACCOUNT_IRA_PHOTO_ID',
  legalDocUrl: 'ACCOUNT_ENTITY_PHOTO_ID',
  formationDoc: 'ACCOUNT_ENTITY_FORMATION',
  operatingAgreementDoc: 'ACCOUNT_ENTITY_OPERATING_AGREEMENT',
  einVerificationDoc: 'ACCOUNT_ENTITY_EIN_VERIFICATION',
};

export const IND_LINK_BANK_MANUALLY = {
  routingNumber: {
    key: 'routingNumber',
    value: '',
    error: undefined,
    rule: 'required|numeric|digits:9',
    placeHolder: '123456789',
    label: 'Bank Routing Number',
    // tooltip: 'Put your 9 digit bank routing number',
    maxLength: 9,
  },
  accountNumber: {
    key: 'accountNumber',
    value: '',
    error: undefined,
    placeHolder: '123456789',
    rule: 'required|minAcnum',
    label: 'Bank Account Number',
    // tooltip: 'Put your 4 to 17 digit bank account number',
    maxLength: 17,
  },
};

export const IND_ADD_FUND = {
  value: {
    value: '',
    key: 'value',
    error: undefined,
    rule: 'optional|numeric|min:100',
    label: 'Deposit Amount',
    maxLength: 15,
    customErrors: {
      min: 'The deposit amount should be at least 100.',
    },
  },
};

export const IND_BANK_ACC_SEARCH = {
  bankName: {
    value: '',
    key: 'bankName',
    error: undefined,
    rule: 'string',
    label: '',
    placeHolder: 'Search',
  },
};

export const IND_BANK_LIST = [
  {
    // name: 'Chase',
    institutionID: 'ins_3',
  },
  {
    // name: 'Bank of America',
    institutionID: 'ins_1',
  },
  {
    // name: 'wells fargo',
    institutionID: 'ins_4',
  },
  {
    // name: 'Citi',
    institutionID: 'ins_5',
  },
  {
    // name: 'US Bank',
    institutionID: 'ins_6',
  },
  {
    // name: 'Capital One',
    institutionID: 'ins_9',
  },
  {
    // name: 'PNC',
    institutionID: 'ins_13',
  },
  {
    // name: 'USAA',
    institutionID: 'ins_7',
  },
];

export const IRA_ACC_TYPES = {
  iraAccountType: {
    value: '',
    values: [
      {
        label: 'Traditional',
        value: 0,
        description: 'Earnings from investments on a Traditional Indiviudal Retirement Account grow tax-deferred.',
        rawValue: 'traditional',
      },
      {
        label: 'Roth',
        value: 1,
        description: 'Earnings from investments on a Traditional Indiviudal Retirement Account grow tax-deferred.',
        rawValue: 'roth',
      },
    ],
    error: undefined,
    rule: 'required',
  },
};

export const IRA_FUNDING = {
  fundingType: {
    value: '',
    values: [
      {
        label: 'Check',
        value: 0,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit for Check!,
        sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam`,
        rawValue: 'check',
      },
      {
        label: 'IRA Transfer',
        value: 1,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit for IRA Transfer!,
        sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam`,
        rawValue: 'iraTransfer',
      },
      {
        label: 'Direct Rollover',
        value: 2,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit for Direct Rollover!,
        sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam`,
        rawValue: 'directRollOver',
      },
    ],
    error: undefined,
    rule: 'required',
  },
};

export const IRA_FIN_INFO = {
  netWorth: {
    key: 'netWorth',
    value: '',
    error: undefined,
    rule: 'required|numeric',
    tooltip: ' Your net worth is calculated by subtracting your liabilities from your assets, excluding your primary residence. See the SEC`s Investor Bulletin for the latest information',
    label: 'Net worth',
    placeHolder: 'Your networth',
    maxLength: 15,
  },
  income: {
    key: 'income',
    value: '',
    error: undefined,
    rule: 'required|numeric',
    tooltip: 'This includes your primary and ancillary income sources. Your joint income with your spouse can also be included.',
    label: 'Annual income',
    placeHolder: 'Your annual income',
    maxLength: 15,
  },
  investmentLimit: {
    key: 'investmentLimit',
    value: '',
    error: undefined,
    rule: 'numeric|min:5000',
  },
};

export const IRA_IDENTITY = {
  identityDoc: {
    value: '',
    key: 'identityDoc',
    error: undefined,
    rule: 'required',
    label: '',
    preSignedUrl: '',
    fileId: '',
    fileData: '',
  },
};

export const ENTITY_FIN_INFO = {
  netAssets: {
    key: 'netAssets',
    value: '',
    label: 'Entity Net Assets',
    error: undefined,
    rule: 'required|numeric',
    maxLength: 15,
  },
  cfInvestment: {
    key: 'cfInvestment',
    value: '',
    label: 'Entity Annual Income',
    error: undefined,
    rule: 'required|numeric',
    maxLength: 15,
  },
  investmentLimit: {
    key: 'investmentLimit',
    value: '',
    error: undefined,
    rule: 'numeric|min:5000',
  },
};

export const ENTITY_GEN_INFO = {
  name: {
    key: 'name', value: '', label: 'Name of Entity', error: undefined, rule: 'required', placeHolder: 'Enter Here',
  },
  taxId: {
    key: 'taxId', value: '', label: 'Tax ID', error: undefined, rule: 'required|taxId', placeHolder: 'XX-XXXXXX',
  },
  entityType: {
    key: 'entityType', value: '', label: 'Entity Type', error: undefined, rule: 'required|string', placeHolder: 'Select one',
  },
  street: {
    key: 'street', value: '', label: 'Street Address', error: undefined, rule: 'required|string', placeHolder: 'Enter Here',
  },
  city: {
    key: 'city', value: '', placeHolder: 'Enter Here', label: 'City', error: undefined, rule: 'required|string',
  },
  state: {
    key: 'state', value: '', placeHolder: 'Select', label: 'State', error: undefined, rule: 'required|string',
  },
  zipCode: {
    key: 'zipCode', value: '', label: 'ZIP Code', placeHolder: 'Enter Here', error: undefined, rule: 'required|numeric',
  },
};

export const ENTITY_TYPES = [
  { key: 'LLC', value: 'LLC', text: 'LLC' },
  { key: 'Corporation', value: 'CORPORATION', text: 'Corporation' },
  { key: 'S-Corporation', value: 'SCORP', text: 'S-Corporation' },
  { key: 'Partnership', value: 'PARTNERSHIP', text: 'Partnership' },
  { key: 'Limited Partnership', value: 'LIMITED_PARTNERSHIP', text: 'Limited Partnership' },
  { key: 'Estate', value: 'ESTATE', text: 'Estate' },
  { key: 'Exempt Organization', value: 'EXEMPT_ORGANIZATION', text: 'Exempt Organization' },
];

export const ENTITY_TRUST_INFO = {
  isTrust: {
    key: 'isTrust',
    value: true,
    values: [{ label: 'Yes', value: true }, { label: 'No', value: false }],
    error: undefined,
    rule: 'required',
  },
  trustDate: {
    key: 'trustDate', value: moment(`${new Date().getFullYear()}-01-01`).format('MM-DD-YYYY'), error: undefined, rule: 'required', label: 'Date of Trust',
  },
};

export const ENTITY_PERSONAL_INFO = {
  title: {
    key: 'title', value: '', error: undefined, rule: 'required', label: 'Title with the Entity', placeHolder: 'e.g. CEO',
  },
  legalDocUrl: {
    key: 'legalDocUrl', value: '', error: undefined, rule: 'required', label: 'Upload a Photo ID (Driver License or Passport)', preSignedUrl: '', fileId: '', fileData: '',
  },
};

export const ENTITY_FORMATION_DOCS = {
  formationDoc: {
    key: 'formationDoc', label: 'Entity Formation Document', value: '', error: undefined, rule: 'required', preSignedUrl: '', fileId: '', fileData: '',
  },
  operatingAgreementDoc: {
    key: 'operatingAgreementDoc', label: 'Entity Operating Agreement', value: '', error: undefined, rule: 'required', preSignedUrl: '', fileId: '', fileData: '',
  },
  einVerificationDoc: {
    key: 'einVerificationDoc', label: 'EIN Verification', value: '', error: undefined, rule: 'required', preSignedUrl: '', fileId: '', fileData: '',
  },
};

export const ACC_TYPE = {
  accType: {
    value: 0,
    values: [
      {
        label: (<label><Icon className="ns-individual-line" />Individual</label>),
        value: 0,
        description: `Open a NextSeed investment account to begin investing in local businesses.
        An initial deposit can be quickly and securely completed by linking your checking account. 
        You can easily connect your account by logging in through our secure system or by 
        manually entering your account information. The uninvested cash in your account is 
        [FDIC-insured][note: hover over with footnote] up to $250,000 and is interest-bearing. 
        We safeguard your information with bank-level security measures.`,
        accType: 'individual',
      },
      {
        label: (<label><Icon className="ns-ira-line" />IRA</label>),
        value: 1,
        description: `Open a self-directed NextSeed IRA to begin investing in local businesses. (Traditional and Roth IRA options available.) 
        Minimum opening deposit: $5,000. Investment limits apply. 
        For new NextSeed IRA accounts, NextSeed will cover the one-time setup fee and annual account
        fees for four years. See the Terms and Conditions for full details`,
        accType: 'ira',
      },
      {
        label: (<label><Icon className="ns-entity-line" />Entity</label>),
        value: 2,
        description: `Invest in local businesses through an Entity investment account. (Note: Investment limits for Entity accounts are treated separately from Individual investment accounts) 
        An initial deposit can be quickly and securely completed by linking your entity checking account. You can easily connect your account by logging in through our secure system or by manually entering your account information. 
        The uninvested cash in your account is [FDIC-insured][note: hover over with footnote] up to $250,000 and is interest-bearing.   We safeguard your information with bank-level security measures.  `,
        accType: 'entity',
      },
    ],
    error: undefined,
    rule: 'required',
  },
};

export const BROKERAGE_EMPLOYMENT = {
  brokerageEmployment: {
    key: 'brokerageEmployment',
    value: '',
    values:
      [
        {
          label: 'Yes', value: 'yes', key: 'Yes', text: 'Yes',
        },
        {
          label: 'No', value: 'no', key: 'No', text: 'No',
        },
      ],
    skipField: true,
    error: undefined,
    rule: 'required',
  },
  brokerageFirmName: {
    key: 'brokerageFirmName',
    value: '',
    label: 'Member Firm Name',
    error: undefined,
    rule: 'required_if:brokerageEmployment,yes',
    placeHolder: 'Enter here',
    customErrors: {
      required_if: 'required',
    },
  },
};

export const PUBLIC_COMPANY_REL = {
  publicCompanyRel: {
    key: 'publicCompanyRel',
    value: '',
    values:
      [
        {
          label: 'Yes', value: 'yes', key: 'Yes', text: 'Yes',
        },
        {
          label: 'No', value: 'no', key: 'No', text: 'No',
        },
      ],
    skipField: true,
    error: undefined,
    rule: 'required',
  },
  publicCompanyTicker: {
    key: 'publicCompanyTicker',
    value: '',
    label: 'Ticker symbol',
    error: undefined,
    rule: 'required_if:publicCompanyRel,yes',
    placeHolder: 'E.g. GOOG',
    customErrors: {
      required_if: 'required',
    },
  },
};

export const EMPLOYMENT = {
  status: {
    key: 'status',
    value: '',
    values:
      [
        {
          label: 'Employed', value: 'EMPLOYED', key: 'Employed', text: 'Employed',
        },
        {
          label: 'Self Employed', value: 'SELF_EMPLOYED', key: 'Self Employed', text: 'Self Employed',
        },
        {
          label: 'Retired', value: 'RETIRED', key: 'Retired', text: 'Retired',
        },
        {
          label: 'Student', value: 'STUDENT', key: 'Student', text: 'Student',
        },
        {
          label: 'Not Employed', value: 'NOT_EMPLOYED', key: 'Not Employed', text: 'Not Employed',
        },
      ],
    error: undefined,
    rule: 'required',
    objRef: 'employment',
    objRefOutput: 'employment',
  },
  employer: {
    key: 'employer',
    value: '',
    label: 'Employer',
    error: undefined,
    rule: 'required_if:status,EMPLOYED',
    placeHolder: 'Type employer name',
    objRef: 'employment',
    objRefOutput: 'employment',
    customErrors: {
      required_if: 'required',
    },
  },
  position: {
    key: 'position',
    value: '',
    label: 'Current Position Held',
    error: undefined,
    rule: 'required_if:status,EMPLOYED',
    placeHolder: 'E.g. CEO',
    objRef: 'employment',
    objRefOutput: 'employment',
    customErrors: {
      required_if: 'required',
    },
  },
};

export const INVESTOR_PROFILE = {
  investorProfileType: {
    value: '',
    values: [{
      label: 'Individual', value: 'INDIVIDUAL', key: 'Individual', text: 'Individual',
    },
    {
      label: 'Joint (Married)', value: 'JOINT', key: 'Joint (Married)', text: 'Joint (Married)',
    }],
    error: undefined,
    rule: 'required',
  },
};

export const FINANCES = {
  investorProfileType: {
    value: '',
    values: [{ label: 'Individual', value: 'INDIVIDUAL' }, { label: 'Joint (Married)', value: 'JOINT' }],
    error: undefined,
    rule: 'required',
    customErrors: {
      required: 'required',
    },
  },
  netWorth: {
    value: '',
    label: 'Net Worth',
    error: undefined,
    rule: 'required',
    placeHolder: 'Net Worth',
    customErrors: {
      required: 'required',
    },
  },
  annualIncomeCurrentYear: {
    value: '',
    label: `Annual Income ${Helper.getLastThreeYearsLabel().annualIncomeCurrentYear}`,
    error: undefined,
    rule: 'required',
    year: '2018',
    placeHolder: '$60,000',
    objRefOutput: 'annualIncome',
    customErrors: {
      required: 'required',
    },
  },
};

export const INVESTMENT_EXPERIENCE = {
  experienceLevel: {
    value: '',
    values: [{ label: 'No experience', value: 'NONE' }, { label: 'I have some experience', value: 'SOME' }, { label: 'I know what I’m doing', value: 'GOOD' }, { label: 'I’m an expert', value: 'EXPERT' }],
    error: undefined,
    rule: 'required',
  },
  isComfortable: {
    value: [],
    values: [
      {
        label: 'Investing in a private business is not for investors with short-term time horizons. I am comfortable investing in securities that have limited liquidity.',
        value: 'checked',
      },
    ],
    error: undefined,
    rule: 'optional',
  },
  isRiskTaker: {
    value: [],
    values: [
      {
        label: 'Investing in a private business involves risk. When investing on NextSeed, I am willing to take on significant risk to potentially earn a return on my investment.',
        value: 'checked',
      },
    ],
    error: undefined,
    rule: 'optional',
  },
};

export const INV_PROFILE = {
  ...EMPLOYMENT,
  ...INVESTOR_PROFILE,
  ...FINANCES,
  ...INVESTMENT_EXPERIENCE,
};

export const VARIFY_ROLES = [
  { key: 'Investment Adviser (SEC-registered)', value: 'Investment Adviser (SEC-registered)', text: 'Investment Adviser (SEC-registered)' },
  { key: 'Broker-Dealer (SEC-registered)', value: 'Broker-Dealer (SEC-registered)', text: 'Broker-Dealer (SEC-registered)' },
  { key: 'Accountant (must be CPA)', value: 'Accountant (must be CPA)', text: 'Accountant (must be CPA)' },
  { key: 'Personal Attorney (properly licensed)', value: 'Personal Attorney (properly licensed)', text: 'Personal Attorney (properly licensed)' },
];


export const INVESTOR_PROFILE_FULL_META = {
  ...INVESTMENT_EXPERIENCE,
  ...EMPLOYMENT,
  ...BROKERAGE_EMPLOYMENT,
  taxFilingAs: FINANCES.investorProfileType,
  netWorth: FINANCES.netWorth,
  annualIncomeCurrentYear: FINANCES.annualIncomeCurrentYear,
  ...PUBLIC_COMPANY_REL,
};

export const INVESTMENT_EXPERIENCE_LIST = [
  { key: 'No experience', value: 'NONE', text: 'No experience' },
  { key: 'I have some experience', value: 'SOME', text: 'I have some experience' },
  { key: 'I know what I’m doing', value: 'GOOD', text: 'I know what I’m doing' },
  { key: 'I’m an expert', value: 'EXPERT', text: 'I’m an expert' },
];

export const EMPLOYMENT_LIST = [
  {
    value: 'EMPLOYED', key: 'Employed', text: 'Employed',
  },
  {
    value: 'SELF_EMPLOYED', key: 'Self Employed', text: 'Self Employed',
  },
  {
    value: 'RETIRED', key: 'Retired', text: 'Retired',
  },
  {
    value: 'STUDENT', key: 'Student', text: 'Student',
  },
  {
    value: 'NOT_EMPLOYED', key: 'Not Employed', text: 'Not Employed',
  },
];

export const BROKERAGE_EMPLOYMENT_LIST = [
  {
    value: 'yes', key: 'Yes', text: 'Yes',
  },
  {
    value: 'no', key: 'No', text: 'No',
  },
];

export const PUBLIC_COMPANY_REL_LIST = [
  {
    value: 'yes', key: 'Yes', text: 'Yes',
  },
  {
    value: 'no', key: 'No', text: 'No',
  },
];

export const INVESTOR_PROFILE_LIST = [
  {
    value: 'INDIVIDUAL', key: 'Individual', text: 'Individual',
  },
  {
    value: 'JOINT', key: 'Joint (Married)', text: 'Joint (Married)',
  },
];
export const FILTER_META = {
  method: {
    value: [],
    values: [
      { text: 'All', value: 'all' },
      { text: 'Verifier', value: 'verifier' },
      { text: 'Upload', value: 'upload' },
    ],
    error: undefined,
    rule: 'empty',
  },
  type: {
    value: [],
    values: [
      { text: 'All', value: 'all' },
      { text: 'Plaid', value: 'plaid' },
      { text: 'Manual', value: 'manual' },
    ],
    error: undefined,
    rule: 'empty',
  },
};

export const LINKED_ACCOUND_STATUS = {
  REQUEST_CANCELLATION: 'Canceled',
  REQUESTED: 'Pending Approval',
  DENIED: 'Declined',
  APPROVED: 'Approved',
};
