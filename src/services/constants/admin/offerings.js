import Validator from 'validatorjs';
import React from 'react';

/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
Validator.register(
  'maskedSSN', (value, attribute) => {
    return value.toString().length === 9;
  },
  'The :attribute is not in the format XXX-XX-XXXX.',
);

export const KEY_TERMS = {
  legalBusinessName: {
    value: '',
    label: 'Legal Name of Business',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'Enter here',
  },
  shorthandBusinessName: {
    value: '',
    label: 'Shorthand Name of Business',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'Enter here',
  },
  businessIndustry: {
    value: '',
    label: 'What Industry is the Business in?',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'Choose here',
  },
  maturity: {
    value: '',
    label: 'Maturity',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
  },
  frequencyOfPayments: {
    value: '',
    label: 'Frequency of Payments',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
  },
  terminationDate: {
    value: '',
    label: 'Offering Termination Date',
    error: undefined,
    rule: 'date|required',
    placeHolder: 'MM-DD-YYYY',
  },
  security: {
    value: '',
    label: 'Securities',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'Choose here',
  },
  securityInterest: {
    value: '',
    label: 'Security Interest',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  ownership: {
    value: '',
    label: 'Ownership % Represented by Securities',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  investmentMuliple: {
    value: '',
    label: 'Investment Multiple',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  revenueSharing: {
    value: '',
    label: 'Revenue Sharing Percentage',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  interestRate: {
    value: '',
    label: 'Interest Rate',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  minOfferingAmount: {
    value: '',
    label: 'Minimum Offering Amount',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  maxOfferingAmount: {
    value: '',
    label: 'Maximum Offering Amount',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  legalBusinessType: {
    value: '',
    label: 'Legal Business Type',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'Choose here',
  },
  nsFeesForMinAmount: {
    value: '',
    label: 'NS Fees if Min Offering Amount is Raised',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Up to $',
  },
  nsFeesForMaxAmount: {
    value: '',
    label: 'NS Fees if Max Offering Amount is Raised',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Up to $',
  },
  goldstarFees: {
    value: '',
    label: 'GoldStar Fees',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  stateOfFormation: {
    value: '',
    label: 'State of Formation',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'Enter here',
  },
  businessCity: {
    value: '',
    label: 'What City is the Business in?',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'Enter here',
  },
  businessState: {
    value: '',
    label: 'What  State is the Business in?',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'Enter here',
  },
  minInvestmentAmount: {
    value: '',
    label: 'Min Investment Amount',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  maxInvestmentAmount: {
    value: '',
    label: 'Max Investment Amount',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  stockType: {
    value: '',
    label: 'Stock Type',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'Enter here',
  },
  offeringExpenseTarget: {
    value: '',
    label: 'Offering Expense Target',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  offeringExpenseMax: {
    value: '',
    label: 'Offering Expense Max',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  revenueSharingSummary: {
    value: '',
    label: 'Revenue Sharing Summary',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
  },
  nsFeeCalculationDescription: {
    value: '',
    label: 'Description of NS Fee Calculation',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
  },
  isNewBusiness: {
    value: '',
    values: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
    label: 'Is the Business a New Business?',
    error: undefined,
    rule: 'required',
  },
  isBusinessInHealthCare: {
    value: '',
    values: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
    label: 'Is the Business in Healthcare Industry?',
    error: undefined,
    rule: 'required',
  },
  isBusinessInOtherIndustries: {
    value: '',
    values: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
    label: `Is the Business in Restaurant, Bar and/or Hospitality
    Industries?`,
    error: undefined,
    rule: 'required',
  },
  doesBusinessServeAlcohol: {
    value: '',
    values: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
    label: 'Does the Business Serve Alcohol?',
    error: undefined,
    rule: 'required',
  },
  proFormas: {
    label: 'Upload Pro Formas',
    value: '',
    error: undefined,
    rule: 'required',
    preSignedUrl: '',
    fileId: '',
    fileData: '',
  },
};

export const BUSINESS_INDUSTRIES = [
  { key: 'CRE', value: 'cre', text: 'CRE' },
  { key: 'Restaurant & Bar', value: 'restaurantAndBar', text: 'Restaurant & Bar' },
  { key: 'Brewery & Brewpub', value: 'breweryAndBrewpub', text: 'Brewery & Brewpub' },
  { key: 'Health & Wellness, Fitness', value: 'healthAndWellnessAndFitness', text: 'Health & Wellness, Fitness' },
  { key: 'Hospitality', value: 'hospitality', text: 'Hospitality' },
  { key: 'Other', value: 'other', text: 'Other' },
];

export const SECURITIES_VALUES = [
  { key: 'Term Note', value: 'termNote', text: 'Term Note' },
  { key: 'Revenue Sharing Note', value: 'revenueSharingNote', text: 'Revenue Sharing Note' },
];

export const BUSINESS_TYPE_VALUES = [
  { key: 'Corporation', value: 'termNote', text: 'Corporation' },
  { key: 'Limited Liability Company', value: 'limitedLiabilityCompany', text: 'Limited Liability Company' },
  { key: 'Limited Partnership', value: 'limitedPartnership', text: 'Limited Partnership' },
];

export const OFFERING_OVERVIEW = {
  elevatorPitch: {
    value: '',
    label: 'Elevator pitch',
    error: undefined,
    rule: 'required',
    placeHolder: 'Describe your project and what you`re raising funds to accomplish.',
  },
  tombstoneDescription: {
    value: '',
    label: 'Tombstone Description',
    error: undefined,
    rule: 'required',
    placeHolder: 'Describe your project and what you`re raising funds to accomplish.',
  },
  facebookProfile: {
    value: '',
    label: 'Facebook',
    error: undefined,
    rule: 'required',
    placeHolder: 'e.g. http://facebook.com/nextbrewery',
  },
  linkedInProfile: {
    value: '',
    label: 'LinkedIn',
    error: undefined,
    rule: 'required',
    placeHolder: 'e.g. http://linkedin.com/nextbrewery',
  },
  twitterProfile: {
    value: '',
    label: 'LinkedIn',
    error: undefined,
    rule: 'required',
    placeHolder: 'e.g. http://twitter.com/nextbrewery',
  },
  instagramProfile: {
    value: '',
    label: 'Instagram',
    error: undefined,
    rule: 'required',
    placeHolder: 'e.g. http://instagram.com/nextbrewery',
  },
  yelpProfile: {
    value: '',
    label: 'Yelp',
    error: undefined,
    rule: 'required',
    placeHolder: 'e.g. http://yelp.com/nextbrewery',
  },
  facebookSharelink: {
    value: '',
    label: 'Sharelink',
    error: undefined,
    rule: 'required',
    placeHolder: 'e.g. http://facebook.com/nextbrewery',
  },
  facebookBlurb: {
    value: '',
    label: 'Blurb',
    error: undefined,
    rule: 'required',
    placeHolder: 'e.g. Company was formed...',
  },
  twitterSharelink: {
    value: '',
    label: 'Sharelink',
    error: undefined,
    rule: 'required',
    placeHolder: 'e.g. http://twitter.com/nextbrewery',
  },
  twitterBlurb: {
    value: '',
    label: 'Blurb',
    error: undefined,
    rule: 'required',
    placeHolder: 'e.g. Company was formed...',
  },
  googleMetadata: {
    value: '',
    label: 'Metadata',
    error: undefined,
    rule: 'required',
    placeHolder: 'e.g. Company was formed...',
  },
  issuerWebsite: {
    value: '',
    label: 'Issuer Website',
    error: undefined,
    rule: 'required',
    placeHolder: 'e.g. http://company.com',
  },
};

export const OFFERING_HIGHLIGHTS = {
  data: [{
    bullet: {
      value: '',
      label: 'Bullet',
      error: undefined,
      rule: 'required',
      placeHolder: 'Type your text here ...',
    },
  }],
};

export const OFFERING_COMPANY = {
  aboutCompany: {
    value: '',
    label: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Tell us about why you started the company/why you`re expanding, what your vision is and walk us through your space.',
  },
  businessModel: {
    value: '',
    label: 'Business Model',
    error: undefined,
    rule: 'required',
    placeHolder: 'Describe your revenue streams and how you will generate business.',
  },
  locationAnalysis: {
    value: '',
    label: 'Location Analysis',
    error: undefined,
    rule: 'required',
    placeHolder: 'Describe the neighborhood, the demographics and what makes your location the best place for your business.',
  },
};

export const COMPANY_HISTORY = {
  data: [{
    date: {
      value: '',
      label: 'Date',
      error: undefined,
      rule: 'required',
      placeHolder: 'January-YYYY',
    },
    description: {
      value: '',
      label: 'Description',
      error: undefined,
      rule: 'required',
      placeHolder: 'e.g. Company was formed...',
    },
  }],
};

export const COMPANY_LAUNCH = {
  issuerReferralCode: {
    value: '',
    label: 'Unique Issuer Referral Code',
    error: undefined,
    rule: 'required',
    placeHolder: 'TeamAG',
  },
  targetLaunchDate: {
    value: '',
    label: 'Target Launch Date',
    error: undefined,
    rule: 'required',
    placeHolder: '4/3/2018',
  },
  terminationDate: {
    value: '',
    label: 'Termination Date',
    error: undefined,
    rule: 'required',
    placeHolder: '4/3/2018',
  },
  expectedOperationsDate: {
    value: '',
    label: 'Expected Operations Date',
    error: undefined,
    rule: 'required',
    placeHolder: '4/3/2018',
  },
  escrowKey: {
    value: '',
    label: 'Escrow Key',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
  },
  escrowNumber: {
    value: '',
    label: 'Escrow Number',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
  },
  edgarLink: {
    value: '',
    label: 'Edgar Link',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
  },
};

export const SIGNED_LEGAL_DOCS = {
  data: [{
    document: {
      fileName: 'form35453.pdf',
      attachedDate: '4/3/18 ',
      label: 'Form C Certificate',
    },
  },
  {
    document: {
      fileName: 'form35453.pdf',
      attachedDate: '4/3/18 ',
      label: 'Form C Certificate',
    },
  },
  {
    document: {
      fileName: 'form35453.pdf',
      attachedDate: '4/3/18 ',
      label: 'Form C Certificate',
    },
  },
  {
    document: {
      fileName: 'form35453.pdf',
      attachedDate: '4/3/18 ',
      label: 'Form C Certificate',
    },
  },
  {
    document: {
      fileName: 'form35453.pdf',
      attachedDate: '4/3/18 ',
      label: 'Form C Certificate',
    },
  },
  {
    document: {
      fileName: 'form35453.pdf',
      attachedDate: '4/3/18 ',
      label: 'Form C Certificate',
    },
  },
  ],
};

export const LAUNCH_CONTITNGENCIES = {
  data: [],
};

export const CLOSING_CONTITNGENCIES = {
  data: [],
};

export const OFFER_CLOSE = {
  disbursementDate: {
    value: '',
    label: 'Disbursement Date',
    error: undefined,
    rule: 'date|required',
    placeHolder: 'MM-DD-YYYY',
  },
  disbursementAmount: {
    value: '',
    label: 'Disbursement Amount',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  totalRepayment: {
    value: '',
    label: 'Total Repayment',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  totalComittedAmount: {
    value: '',
    label: 'Total Comitted Amount',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  totalInvestorsCount: {
    value: '',
    label: 'Total Investors Count',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
};

export const CONTINGENCIES = {
  data: [{
    isApplied: {
      value: [],
      values: [
        {
          label: '',
          value: 'IS_APPLIED',
        },
      ],
      error: undefined,
      rule: 'alpha',
    },
    name: {
      value: '',
      label: 'Contingency Name',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Enter here',
    },
    acceptanceCriteria: {
      value: '',
      label: 'Acceptance Criteria',
      error: undefined,
      rule: 'required',
      placeHolder: 'Enter here',
    },
    comment: {
      value: '',
      label: '',
      error: undefined,
      rule: 'required_if:data.*.isApplied,isApplied',
      placeHolder: 'Enter comment here...',
    },
  }],
};

export const ADD_NEW_CONTINGENCY = {
  name: {
    value: '',
    label: 'Contingency Name',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'Enter here',
  },
  acceptanceCriteria: {
    value: '',
    label: 'Acceptance Criteria',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
  },
};

export const OFFERING_DETAILS = {
  offeringUrl: {
    value: '',
    label: 'Offering Url',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
  },
  offeringReferralCode: {
    value: '',
    label: 'Offering Referral Code',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
  },
};

export const LEADERSHIP = {
  data: [{
    includeInOfferingPage: {
      value: [],
      values: [
        {
          label: 'Include in Offering Page',
          value: 'IS_APPLIED',
        },
      ],
      error: undefined,
      rule: 'alpha',
    },
    firstName: {
      value: '',
      label: 'First Name',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'e.g. John',
    },
    lastName: {
      value: '',
      label: 'Last name',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'e.g. Doe',
    },
    emailAddress: {
      value: '',
      label: 'E-mail address',
      error: undefined,
      rule: 'email|required',
      placeHolder: 'john.doe@contact.com',
    },
    phoneNumber: {
      value: '',
      label: 'Phone Number',
      error: undefined,
      rule: 'numeric|required',
      placeHolder: '555-123-8888',
    },
    dob: {
      value: '',
      label: 'DOB',
      error: undefined,
      rule: 'date|required',
      placeHolder: 'MM/DD/YYYY',
    },
    ssn: {
      value: '',
      label: 'SSN',
      placeHolder: 'XXX-XXX-XXXX',
      error: undefined,
      rule: 'required|maskedSSN',
    },
    countryOfCitizanship: {
      value: '',
      label: 'Country of Citizenship',
      placeHolder: 'United States',
      error: undefined,
      rule: 'required|string',
    },
    percentageOwned: {
      value: '',
      label: 'Percentage Owned',
      placeHolder: '10.0%',
      error: undefined,
      rule: 'required|numeric',
      tooltip: 'List any person who owns, directly or indirectly, 20% or more of the Issuer’s equity, based on voting power',
    },
    companyPosition: {
      value: '',
      label: 'Company Position',
      placeHolder: 'e.g. CEO',
      error: undefined,
      rule: 'required|string',
    },
    startDateOfService: {
      value: '',
      label: 'Start Date of Service',
      error: undefined,
      rule: 'date|required',
      placeHolder: 'MM-DD-YYYY',
      tooltip: 'If you had left the company previously and are returning, enter the start date of your current employment position.',
    },
    residentialStreet: {
      value: '',
      label: 'Residential Street',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'e.g. Baker Street 221B',
    },
    city: {
      value: '',
      label: 'City',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'e.g. New York',
    },
    state: {
      value: '',
      label: 'State',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'e.g. New York',
    },
    zipCode: {
      value: '',
      label: 'ZIP Code',
      error: undefined,
      rule: 'numeric|required',
      placeHolder: 'e.g. 10001',
    },
    bio: {
      value: '',
      label: 'Bio',
      error: undefined,
      rule: 'required',
      placeHolder: 'Enter here ...',
    },
    website: {
      value: '',
      label: 'Website',
      error: undefined,
      rule: 'required',
      placeHolder: 'e.g. http://johndoe.com',
    },
    facebook: {
      value: '',
      label: 'Facebook',
      error: undefined,
      rule: 'required',
      placeHolder: 'e.g. http://facebook.com/johndoe',
    },
    linkedIn: {
      value: '',
      label: 'LinkedIn',
      error: undefined,
      rule: 'required',
      placeHolder: 'e.g. http://linkedin.com/johndoe',
    },
    twitter: {
      value: '',
      label: 'Twitter',
      error: undefined,
      rule: 'required',
      placeHolder: 'e.g. http://twitter.com/johndoe',
    },
    headShot: {
      label: 'Headshot',
      value: '',
      error: undefined,
      rule: 'required',
      preSignedUrl: '',
      fileId: '',
      fileData: '',
    },
    heroImage: {
      label: 'Hero Image',
      value: '',
      error: undefined,
      rule: 'required',
      preSignedUrl: '',
      fileId: '',
      fileData: '',
    },
    driverLicense: {
      label: 'Driver’s License',
      value: '',
      error: undefined,
      rule: 'required',
      preSignedUrl: '',
      fileId: '',
      fileData: '',
    },
    namesOfOtherEntities: {
      label: 'Names of other entities over which you have control',
      value: '',
      error: undefined,
      rule: 'required',
      placeHolder: 'Enter here',
    },
    namesOfPromoters: {
      label: 'Names of promoters that have been or will be paid in connection with promoting the Issuer`s securities during offering',
      value: '',
      error: undefined,
      rule: 'required',
      placeHolder: 'Enter here',
    },
  }],
};

export const BUSINESS = {
  businessName: {
    label: 'Business Name',
    value: '',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'e.g. John Doe',
  },
  typeOfBusiness: {
    label: 'Type of Business',
    value: '',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'e.g. bakery',
  },
  dateOfService: {
    label: 'Dates of Service',
    value: '',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'MM-DD-YYYY',
  },
  title: {
    label: 'Title',
    value: '',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'Enter here',
  },
  description: {
    label: 'Description',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
  },
};

export const GENERAL = {
  websiteUrl: {
    label: 'Website URL',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'e.g. http://simplebits.com',
    tooltip: 'Enter Issuer’s Website',
  },
  monthOfOfferingLaunch: {
    label: 'Month of Offering Launch',
    value: '',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'Enter here',
  },
  offeringDeadline: {
    label: 'Offering Deadline',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Month 20XX',
  },
  employmentIdentificationNumber: {
    label: 'Employment Identification Number',
    value: '',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  numberOfEmployees: {
    label: 'Number of Employees',
    value: '',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
    tooltip: 'Including owners/officers of the company',
  },
  businessStreetAddress: {
    label: 'Business Street Address',
    value: '',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'Enter here',
  },
  businessCity: {
    label: 'Business City',
    value: '',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'Enter here',
  },
  businessState: {
    label: 'Business State',
    value: '',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'Enter here',
  },
  businessStreetZip: {
    label: 'Business Street Zip',
    value: '',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  businessPhoneNumber: {
    label: 'Business Phone Number',
    value: '',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  bankName: {
    label: 'Bank Name',
    value: '',
    error: undefined,
    rule: 'string|required',
    placeHolder: 'Enter here',
  },
  bankRoutingNumber: {
    label: 'Bank Routing Number',
    value: '',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  bankAccountNumber: {
    label: 'Bank Account Number',
    value: '',
    error: undefined,
    rule: 'numeric|required',
    placeHolder: 'Enter here',
  },
  businessCapitalization: {
    label: 'In this section you will describe the current financial condition of your business. Topics include liquidity, capital resources, and historical results of operations. Included is a sample for a recently formed business',
    value: '',
    error: undefined,
    rule: 'required',
  },
  ifMinOfferingAmtReached: {
    label: 'If minimum offering amount is reached:',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Type your text here...',
  },
  ifMaxOfferingAmtReached: {
    label: 'If maximum offering amount is reached:',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Type your text here...',
  },
  rightsOfYourEquityShareholders: {
    label: 'Please provide a description of how the exercise of rights held by the principal shareholders of the issuer could affect the purchasers of the securities being offered. Included is an example.',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'The principal shareholders identified herein are holders of equity interests in the Issuer, distinct from the Securities offered to investors through the Offering. While holders of equity interests may have certain voting rights under the operating agreement of the Issuer, the Securities are debt securities and their terms are governed solely by the NPA and the accompanying notes. Please see Section VII – “Certain Legal Matters and Tax Considerations” – for more information. For the avoidance of doubt, the Member may not limit, dilute or qualify the Securities issued pursuant to this Offering.',
  },
  existingSecurities: [{
    classOfSecurity: {
      label: 'Class of Security',
      value: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Type your text here...',
    },
    votingRights: {
      label: 'Voting Rights',
      value: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Type your text here...',
    },
    securitiesAuthorized: {
      label: 'Securities (or Amount) Authorized',
      value: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Type your text here...',
    },
    securitiesOutstanding: {
      label: 'Securities (or Amount) Outstanding',
      value: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Type your text here...',
    },
    securityLimit: {
      label: 'How this security may limit, dilute or qualify the Securities issued pursuant to this Offering',
      value: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Type your text here...',
    },
  }],
  otherExemptOfferings: [{
    dateOfOffering: {
      label: 'Date of Offering',
      value: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Type your text here...',
      tooltip: 'Provide a date range (e.g., July - Sept. 2016)',
    },
    securitiesExemptionReliedUpon: {
      label: 'Securities Exemption Relied Upon',
      value: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Type your text here...',
      tooltip: (<span>See this link <a href="https://www.sec.gov/smallbusiness/exemptofferings" target="_blank" rel="noopener noreferrer">https://www.sec.gov/smallbusiness/exemptofferings</a> for more information from the SEC</span>),
    },
    securitiesOffered: {
      label: 'Securities Offered',
      value: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Type your text here...',
    },
    amountSold: {
      label: 'Amount Sold',
      value: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Type your text here...',
    },
    useOfProceeds: {
      label: 'Use of Proceeds',
      value: '',
      error: undefined,
      rule: 'required',
      placeHolder: 'Type your text here...',
    },
  }],
  materialTerms: [{
    creditorName: {
      label: 'Creditor Name',
      value: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Type your text here...',
    },
    amountOutStanding: {
      label: 'Amount Outstanding',
      value: '',
      error: undefined,
      rule: 'numeric|required',
      placeHolder: '$100,000',
    },
    interestRate: {
      label: 'Interest Rate',
      value: '',
      error: undefined,
      rule: 'numeric|required',
      placeHolder: '10.0%',
    },
    maturityDate: {
      label: 'Maturity Date',
      value: '',
      error: undefined,
      rule: 'date|required',
      placeHolder: 'Select date',
    },
    paymentSchedule: {
      label: 'Payment Schedule',
      value: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Type your text here...',
      tooltip: 'e.g. Weekly/monthly and how much per payment',
    },
    otherMaterialTerms: {
      label: 'Other Material Terms',
      value: '',
      error: undefined,
      rule: 'required',
      placeHolder: 'Type your text here...',
    },
  }],
  affiliatedPartyTransactions: [{
    name: {
      label: 'Name',
      value: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'John Doe',
    },
    relationshipToIssuer: {
      label: 'Relationship to Issuer',
      value: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Brother',
    },
    amountOfTransaction: {
      label: 'Amount of Transaction',
      value: '',
      error: undefined,
      rule: 'numeric|required',
      placeHolder: 'Enter here',
    },
    description: {
      label: 'Describe the Transaction',
      value: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Type your text here...',
    },
  }],
};

export const RISK_FACTORS = {
  isBusinessRisk: {
    label: 'Business Risk',
    value: [],
    values: [
      {
        label: '',
        value: 'BUSINESS_RISK',
      },
    ],
    error: undefined,
    rule: 'alpha',
  },
  businessRiskDesc: {
    label: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Any operational growth will place additional demands on our administrative, management and financial resources. It is imperative that we manage our growth; if we do not effectively manage growth, our operations and financial condition may be negatively impacted. The timing and extent of future growth depends, in part, on our ability to manage its organizational structure and financial resources. ',
  },
  isFinancingRisks: {
    label: 'Financing Risks',
    value: [],
    values: [
      {
        label: '',
        value: 'FINANCING_RISKS',
      },
    ],
    error: undefined,
    rule: 'alpha',
  },
  financingRisksDesc: {
    label: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Any operational growth will place additional demands on our administrative, management and financial resources. It is imperative that we manage our growth; if we do not effectively manage growth, our operations and financial condition may be negatively impacted. The timing and extent of future growth depends, in part, on our ability to manage its organizational structure and financial resources. ',
  },
  isDevelopmentRisks: {
    label: 'Development Risks',
    value: [],
    values: [
      {
        label: '',
        value: 'DEVELOPMENT_RISKS',
      },
    ],
    error: undefined,
    rule: 'alpha',
  },
  developmentRisksDesc: {
    label: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Any operational growth will place additional demands on our administrative, management and financial resources. It is imperative that we manage our growth; if we do not effectively manage growth, our operations and financial condition may be negatively impacted. The timing and extent of future growth depends, in part, on our ability to manage its organizational structure and financial resources. ',
  },
  isReputationalRisk: {
    label: 'Reputational Risk',
    value: [],
    values: [
      {
        label: '',
        value: 'REPUTATIONAL_RISK',
      },
    ],
    error: undefined,
    rule: 'alpha',
  },
  reputationalRiskDesc: {
    label: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Any operational growth will place additional demands on our administrative, management and financial resources. It is imperative that we manage our growth; if we do not effectively manage growth, our operations and financial condition may be negatively impacted. The timing and extent of future growth depends, in part, on our ability to manage its organizational structure and financial resources. ',
  },
  isCompetitionRisks: {
    label: 'Competition Risks',
    value: [],
    values: [
      {
        label: '',
        value: 'COMPETITION_RISKS',
      },
    ],
    error: undefined,
    rule: 'alpha',
  },
  competitionRisksDesc: {
    label: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Any operational growth will place additional demands on our administrative, management and financial resources. It is imperative that we manage our growth; if we do not effectively manage growth, our operations and financial condition may be negatively impacted. The timing and extent of future growth depends, in part, on our ability to manage its organizational structure and financial resources. ',
  },
  isMarketRisks: {
    label: 'Market Risks',
    value: [],
    values: [
      {
        label: '',
        value: 'MARKET_RISKS',
      },
    ],
    error: undefined,
    rule: 'alpha',
  },
  marketRisksDesc: {
    label: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Any operational growth will place additional demands on our administrative, management and financial resources. It is imperative that we manage our growth; if we do not effectively manage growth, our operations and financial condition may be negatively impacted. The timing and extent of future growth depends, in part, on our ability to manage its organizational structure and financial resources. ',
  },
  isNaturalRisks: {
    label: 'Risks from Work Stoppages, Terrorism or Natural Disasters',
    value: [],
    values: [
      {
        label: '',
        value: 'NATURAL_RISKS',
      },
    ],
    error: undefined,
    rule: 'alpha',
  },
  naturalRisksDesc: {
    label: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Any operational growth will place additional demands on our administrative, management and financial resources. It is imperative that we manage our growth; if we do not effectively manage growth, our operations and financial condition may be negatively impacted. The timing and extent of future growth depends, in part, on our ability to manage its organizational structure and financial resources. ',
  },
  isManagementRisks: {
    label: 'Management Risks',
    value: [],
    values: [
      {
        label: '',
        value: 'MANAGEMENT_RISKS',
      },
    ],
    error: undefined,
    rule: 'alpha',
  },
  managementRisksDesc: {
    label: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Any operational growth will place additional demands on our administrative, management and financial resources. It is imperative that we manage our growth; if we do not effectively manage growth, our operations and financial condition may be negatively impacted. The timing and extent of future growth depends, in part, on our ability to manage its organizational structure and financial resources. ',
  },
  isPersonnelRisks: {
    label: 'Personnel Risks',
    value: [],
    values: [
      {
        label: '',
        value: 'PERSONNEL_RISKS',
      },
    ],
    error: undefined,
    rule: 'alpha',
  },
  personnelRisksDesc: {
    label: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Any operational growth will place additional demands on our administrative, management and financial resources. It is imperative that we manage our growth; if we do not effectively manage growth, our operations and financial condition may be negatively impacted. The timing and extent of future growth depends, in part, on our ability to manage its organizational structure and financial resources. ',
  },
  isLaborSupplyRisks: {
    label: 'Labor Supply Risks',
    value: [],
    values: [
      {
        label: '',
        value: 'LABOR_SUPPLY_RISKS',
      },
    ],
    error: undefined,
    rule: 'alpha',
  },
  laborSupplyRisksDesc: {
    label: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Any operational growth will place additional demands on our administrative, management and financial resources. It is imperative that we manage our growth; if we do not effectively manage growth, our operations and financial condition may be negatively impacted. The timing and extent of future growth depends, in part, on our ability to manage its organizational structure and financial resources. ',
  },
  isPrivacyRisks: {
    label: 'Privacy Risks',
    value: [],
    values: [
      {
        label: '',
        value: 'PRIVACY_RISKS',
      },
    ],
    error: undefined,
    rule: 'alpha',
  },
  privacyRisksDesc: {
    label: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Any operational growth will place additional demands on our administrative, management and financial resources. It is imperative that we manage our growth; if we do not effectively manage growth, our operations and financial condition may be negatively impacted. The timing and extent of future growth depends, in part, on our ability to manage its organizational structure and financial resources. ',
  },
  isOtherRisks: {
    label: 'Other Risks',
    value: [],
    values: [
      {
        label: '',
        value: 'PRIVACY_RISKS',
      },
    ],
    error: undefined,
    rule: 'alpha',
  },
  otherRisksDesc: {
    label: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.',
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Any operational growth will place additional demands on our administrative, management and financial resources. It is imperative that we manage our growth; if we do not effectively manage growth, our operations and financial condition may be negatively impacted. The timing and extent of future growth depends, in part, on our ability to manage its organizational structure and financial resources. ',
  },
};
