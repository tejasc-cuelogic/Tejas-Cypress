export const CATEGORY_DATA = [
  { title: 'Investor FAQ', enum: 'INV_FAQ' },
  { title: 'Issuer FAQ', enum: 'ISSUER_FAQ' },
  { title: 'Issuer Knowledge Base', enum: 'ISSUER_KB' },
  { title: 'Investor Knowledge Base', enum: 'INVESTOR_KB' },
  { title: 'Offerings', enum: 'OFFERINGS' },
  { title: 'Insights', enum: 'INSIGHTS' },
];

export const CATEGORY_DETAILS = {
  categoryName: {
    value: '',
    label: 'Category Name',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
    customErrors: {
      required: 'This field is required',
    },
  },
  description: {
    value: '',
    label: 'Category Description',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
    customErrors: {
      required: 'This field is required',
    },
  },
  categoryType: {
    value: '',
    label: 'Category Type',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
  },
};
