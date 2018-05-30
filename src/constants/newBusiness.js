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
    placeHolder: 'e.g. 5',
  },
  estCreditScore: {
    value: '', label: 'What is your estimated credit score?', error: undefined, rule: 'required|numeric', placeHolder: 'e.g. 700',
  },
  projectCost: {
    value: '', label: 'What’s the total project cost?', error: undefined, rule: 'required', placeHolder: 'e.g. 100,000',
  },
  raiseRequired: {
    value: '',
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
};
