export const BUSINESS_PRE_QUALIFICATION = {
  businessType: {
    value: 'btoc',
    values: [
      { label: 'Business to Consumer', value: 'btoc' },
      { label: 'Business to Business', value: 'btob' },
    ],
    error: undefined,
    rule: 'required',
  },
  businessName: {
    value: '', label: 'Business Name', error: undefined, rule: 'required|string', placeHolder: 'e.g.  NextBrewery',
  },
  businessZipCode: {
    value: '', label: 'Business ZIP Code', error: undefined, rule: 'required|numeric', placeHolder: '10012', maxLength: 6,
  },
  webSite: {
    value: '', label: 'Website', error: undefined, rule: 'required|url', placeHolder: 'e.g.  NextBrewery',
  },
  phoneNumber: {
    value: '', label: 'Phone Number', error: undefined, rule: 'required', placeHolder: '(123) 456 789',
  },
  emailAddress: {
    value: '', label: 'Email Address', error: undefined, rule: 'required|email', placeHolder: 'e.g.next.brewery@contact.com',
  },
  businessStreet: {
    value: '', label: 'Street', error: undefined, rule: 'required',
  },
  city: {
    value: '', label: 'City', error: undefined, rule: 'required',
  },
  state: {
    value: '', label: 'State', error: undefined, rule: 'required',
  },
  zipCode: {
    value: '', label: 'Zip Code', error: undefined, rule: 'required|numeric', maxLength: 6,
  },
  relatedExperience: {
    value: '',
    label: 'How many years of related industry experience does your team have?',
    error: undefined,
    rule: 'required|numeric',
    maxLength: 2,
    placeHolder: 'e.g. 5',
  },
  estCreditScore: {
    value: '', maxLength: 8, label: 'What is your estimated credit score?', error: undefined, rule: 'required|numeric', placeHolder: 'e.g. 700',
  },
  projectCost: {
    value: '', maxLength: 16, label: 'What’s the total project cost?', error: undefined, rule: 'required', placeHolder: 'e.g. 100,000',
  },
  raiseRequired: {
    value: '',
    maxLength: 16,
    label: 'How much do you need to raise on NextSeed?',
    error: undefined,
    rule: 'required',
    placeHolder: 'e.g. 50,000',
    tooltip: 'Minimum amount of funding is $50,000. For requirements on different levels of funding, click here.',
  },
  grossSales: {
    value: '', label: 'Gross Sales', error: undefined, rule: 'required', placeHolder: 'e.g. 750,000',
  },
  goodsSold: {
    value: '', label: 'Cost of Goods Sold', error: undefined, rule: 'required', placeHolder: 'e.g. 75,000',
  },
  operatingExpenses: {
    value: '', label: 'Operating Expenses', error: undefined, rule: 'required', placeHolder: 'e.g. 150,000',
  },
  netIncome: {
    value: '', label: 'Net Income', error: undefined, rule: 'required', placeHolder: 'e.g. 525,000',
  },
  industryType: {
    value: [],
    values: [
      { label: 'Fashion & Merchandising', icon: 'ns-store', value: 'fashionmerchandising' },
      { label: 'Beauty & Spa', icon: 'ns-beauty-spa', value: 'beautyspa' },
      { label: 'Food & Beverage', icon: 'ns-food-light', value: 'foodbeverage' },
      { label: 'Real Estate', icon: 'ns-real-estate', value: 'realestate' },
      { label: 'Fitness & Wellness', icon: 'ns-fitness', value: 'fitnesswellness' },
      { label: 'Hospitality', icon: 'ns-first-aid', value: 'hospitality' },
      { label: 'Technology', icon: 'ns-technology', value: 'technology' },
      { label: 'Other Industry Type', value: 'otherindustrytype' },
    ],
    error: undefined,
    rule: 'required',
  },
  businessHelp: {
    value: 'newbusiness',
    values: [
      { label: 'Launch New Business', icon: 'ns-new-business', value: 'newbusiness' },
      { label: 'Open Franchise', icon: 'ns-franchise', value: 'openfranchise' },
      { label: 'Expand/Upgrade Existing Business', icon: 'ns-expand-business', value: 'expandbusiness' },
      { label: 'Create Off-shoot of Existing Business', icon: 'ns-off-shoot-business', value: 'createoffshoot' },
    ],
    error: undefined,
    rule: 'required',
  },
  fundUsage: {
    value: [],
    values: [
      { label: 'Renovations', icon: 'ns-renovations', value: 'renovations' },
      { label: 'Equipment Purchase', icon: 'ns-equipment-purchase', value: 'equipmentpurchase' },
      { label: 'Working Capital', icon: 'ns-working-capital', value: 'workingcapital' },
      { label: 'Inventory', icon: 'ns-inventory', value: 'inventory' },
      { label: 'New product line', icon: 'ns-new-product', value: 'newproductline' },
      { label: 'New location', icon: 'ns-new-location', value: 'newlocation' },
      { label: 'Restructure debt', icon: 'ns-restructure-debt', value: 'restructuredebt' },
      { label: 'Other Industry Type', value: 'otherindustrytype' },
    ],
    error: undefined,
    rule: 'required',
  },
  entityStructure: {
    value: 'corporation',
    values: [
      { label: 'Corporation', icon: 'ns-corporation', value: 'corporation' },
      { label: 'LLC', icon: 'ns-business', value: 'llc' },
      { label: 'Limited Partnership', icon: 'ns-partnership', value: 'limitedpartnership' },
      { label: 'Sole Proprietor', icon: 'ns-proprietor', value: 'soleproprietor' },
      { label: 'Other', value: 'other' },
    ],
    error: undefined,
    rule: 'required',
  },
  legalConfirmation: {
    value: [],
    values: [
      {
        label: 'The company has not raised securities under Regulation Crowdfunding in the last 12 months.',
        value: 'legalConfirmation01',
      },
      {
        label: 'The company is not concurrently conducting an offering on another platform.',
        value: 'legalConfirmation02',
      },
      {
        label: 'The company is not a broker-dealer.',
        value: 'legalConfirmation03',
      },
      {
        label: 'The company is organized in the United States',
        value: 'legalConfirmation04',
      },
      {
        label: 'The company is not an investment company.',
        value: 'legalConfirmation05',
      },
      {
        label: 'The company has not sold securities registered under the Securities Exchange Act of 1934.',
        value: 'legalConfirmation06',
      },
      {
        label: 'I have never filed for bankruptcy.',
        value: 'legalConfirmation07',
        tooltip: 'If you have filed for bankruptcy, a NextSeed representative may follow up to verity the details of the bankruptcy',
      },
      {
        label: 'I am not currently charged with or have ever been convicted of fraud.',
        value: 'legalConfirmation08',
      },
      {
        label: 'I am not currently charged with or have ever been convicted of a serious criminal offense.',
        value: 'legalConfirmation09',
      },
      {
        label: 'Please check here if you wish to subscribe to the latest news and offers from NextSeed. You may unsubscribe at any time',
        value: 'legalConfirmation10',
      },
    ],
    error: undefined,
    rule: 'required',
  },
  password: {
    value: '', label: 'Password', error: undefined, rule: 'required', placeHolder: 'Password',
  },
  existingDebt1: {
    value: '', label: 'Existing Debt 1', error: undefined, rule: 'required', placeHolder: '500,000',
  },
  remainingPrincipal: {
    value: '', label: 'Remaining Principal', error: undefined, rule: 'required', placeHolder: '500,000',
  },
  interestExpenses: {
    value: '', label: 'Interest Expenses', error: undefined, rule: 'required', placeHolder: '10.0 %',
  },
  termMonths: {
    value: '', label: 'Term (in months)', error: undefined, rule: 'required', placeHolder: '5',
  },
};
