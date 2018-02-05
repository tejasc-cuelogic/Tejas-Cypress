export const FORM_VALUES = [
  { name: 'name_of_business', placeholder: 'Business Name' },
  { name: 'shorthand_name', placeholder: 'Shorthand Name' },
  { name: 'type_of_business', placeholder: 'Business Type' },
  { name: 'state_of_formation', placeholder: 'State of Formation' },
  { name: 'investment_multiple', placeholder: 'Investment Multiple', width: 4 },
  { name: 'revenue_share_percentage', placeholder: 'Percent Share in revenue', width: 4 },
  { name: 'minimum_offering_amount', placeholder: 'Minimum offering amount', width: 4 },
  { name: 'offering_amount', placeholder: 'Offering Amount', width: 4 },
  { name: 'interest_rate', placeholder: 'Interest Rate', width: 4 },
  { name: 'maturity_date', placeholder: 'Maturity Date', width: 4 },
  { name: 'termination_date', placeholder: 'Termination Date', width: 4 },
  { name: 'offer_date', placeholder: 'Offer Date', width: 4 },
];

export const DOCFILE_TYPES = {
  'Form C Issuer Certificate.docx': true,
  'Form Security Agreement.doc': true,
  'Form of Note Purchase Agreement - Revenue Share.docx': true,
  'Form of Note Purchase Agreement - Term Note.docx': true,
  'Goldstar Escrow Agreement (Form).docx': true,
  'National - Template Disclosure Statement (Rev).docx': true,
  'National - Template Disclosure Statement (Term).docx': true,
  'National Portal - Form of Crowdfunding Portal Agreement (Rev Share).docx': true,
  'National Portal - Form of Crowdfunding Portal Agreement (Term).docx': true,
  'Resolution - Borrowing Authority (Form).docx': true,
};

export const EDGAR_URL = 'https://6fqagvjv78.execute-api.us-east-1.amazonaws.com/dev/edgar/publish';
