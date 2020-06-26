import React from 'react';
import { Link } from 'react-router-dom';
import { Popup, List } from 'semantic-ui-react';
import { FormHelper } from '../../helper';


export const INVESTMENT_INFO = {
  investmentAmount: {
    label: 'Investment Amount',
    key: 'investmentAmount',
    value: '',
    error: undefined,
    customErrors: {
      required: '* required.',
    },
    rule: 'required|hundreds',
    placeHolder: '$ 0',
    maxLength: 15,
  },

};

export const PREFERRED_EQUITY_INVESTMENT_INFO = {
  shares: {
    label: 'Shares',
    key: 'shares',
    value: '',
    error: undefined,
    customErrors: {
      required: '* required.',
    },
    rule: 'required',
    placeHolder: 'Enter here',
    maxLength: 15,
  },
};

export const TRANSFER_REQ_INFO = {
  investmentAmount: {
    label: 'investmentAmount',
    key: 'investmentAmount',
    value: '500',
    error: undefined,
    rule: 'required|numeric',
    placeHolder: '',
    maxLength: 15,
  },
  cashAvailable: {
    label: 'cashAvailable',
    key: 'cashAvailable',
    value: '500',
    error: undefined,
    rule: 'required|numeric',
    placeHolder: '',
    maxLength: 15,
  },
  availableCredits: {
    label: 'availableCredits',
    key: 'availableCredits',
    value: '',
    error: undefined,
    customErrors: {
      required: '* required.',
    },
    rule: 'required',
    placeHolder: '',
    maxLength: 15,
  },
};

export const INVEST_ACCOUNT_TYPES = {
  value: '',
  values: [],
  error: undefined,
  rule: 'required',
};

export const AGREEMENT_TEMPLATE_DETAILS_INFO = {
  page: [{
    toc: {
    value: [],
    values: [],
    error: undefined,
    rule: 'required',
    defaultValue: [],
  },
  title: {
    value: '',
    label: '',
    error: undefined,
    rule: 'required',
  },
  hideHeader: {
    value: '',
    label: '',
    error: undefined,
    rule: 'optional',
  },
  }],
};


export const AGREEMENT_DETAILS_INFO = {
  checkboxesLeft: {
    value: [],
    values: [
      {
        label: 'I understand that I may not be able to cancel my investment commitment or obtain a return of my investment.', value: '1',
      },
      {
        label: 'I understand that I may not be able to sell the securities I am acquiring in this offering.', value: '2',
      },
      {
        label: 'I understand that investing in securities sold in reliance on Regulation Crowdfunding involves risks and I should not invest any funds unless I can afford to lose the entire amount.',
        value: '3',
        customRegulationLabel: true,
      },
      {
        tooltip: (
          <Popup.Content>
            <p>
              Regulation Crowdfunding limits the total amount you can invest in a
              12-month period:
            </p>
            <List relaxed bulleted>
              <List.Item>
                If either your annual income or net worth is less than $107,000, you can invest
                5% of the lower figure. But anyone can invest at least $2,200.
              </List.Item>
              <List.Item>
                If both your annual income and net worth are greater than $107,000, you can
                invest 10% of the lower figure. But no one can invest more than $107,000.
              </List.Item>
              <List.Item>
                If you invest through an entity, the same rules apply based on the entity’s
                revenue and net assets (as of its most recent fiscal year end).
              </List.Item>
            </List>
          </Popup.Content>
        ),
        label: (
          <>
            I confirm that I am complying with my <b>annual investment limit</b> (<Link to="/offerings/live-test-new-vp/agreement/change-investment-limit">update</Link>)
          </>
        ),
        value: '4',
        customUpdateLimitLabel: true,
      },
    ],
    error: undefined,
    rule: 'required|min:4',
  },
  checkboxesRight: {
    value: [],
    values: [
      {
        label: (
          <>
            I have reviewed and agree to the terms of the Note Purchase Agreement.
          </>
        ),
        value: '5',
        customLabel: true,
      },
      {
        label: (
          <>
            I have reviewed NextSeed’s <Link to="/resources/education-center/investor">educational materials</Link>, understand that
            the entire amount of my investment may be lost, and confirm that I am in a
            financial condition to bear the loss. I have read and agree to the terms of
            the <a href="/">CrowdPay Custodial Account Agreement</a>,
            the <a href="/">Substitute IRS Form W-9 Certification</a>,
            and <a href="/">NextSeed Securities LLC Investor Agreement</a>
          </>
        ),
        value: '6',
        conditionalCustomLabel: true,
      },
    ],
    error: undefined,
    rule: 'required|min:2',
  },
};

export const INVESTMENT_LIMITS = {
  netWorth: {
    value: '',
    label: 'Net Worth',
    error: undefined,
    rule: 'numeric|required',
    tooltip: 'Mention your Net Worth here',
  },
  annualIncome: {
    value: '',
    label: 'Annual Income',
    error: undefined,
    rule: 'numeric|required',
    tooltip: 'Mention your Annual Income here',
  },
  cfInvestments: {
    value: '',
    label: 'Other Regulation Crowdfunding investments made in prior 12 months',
    error: undefined,
    rule: 'numeric|required',
    tooltip: 'Other Crowdfunding investments',
  },
};

export const CANCEL_INVESTMENT = FormHelper.generateMeta([
  ['voidReason', 'Void Reason', '', 'optional', 'Void Reason'],
  ['voidType', 'Void Type', 'ADMINCANCEL', 'optional', 'Void Type'],
  ['sendNotification', 'Send Notification', '', 'optional', ''],
]);

export const VOID_TYPE = [
  { key: 'NOSIGN', value: 'NOSIGN', text: 'NO SIGN' },
  { key: 'USERCANCEL', value: 'USERCANCEL', text: 'USER CANCEL' },
  { key: 'REPLACED', value: 'REPLACED', text: 'REPLACED' },
  { key: 'AUTODRAFTFAILED', value: 'AUTODRAFTFAILED', text: 'AUTO DRAFT FAILED' },
  { key: 'FAILEDVALIDATION_PRESIGN', value: 'FAILEDVALIDATION_PRESIGN', text: 'FAILED VALIDATION PRESIGN' },
  { key: 'FAILEDVALIDATION_POSTSIGN', value: 'FAILEDVALIDATION_POSTSIGN', text: 'FAILED VALIDATION POSTSIGN' },
  { key: 'ERROR', value: 'ERROR', text: 'ERROR' },
  { key: 'OFFERING_RESET', value: 'OFFERING_RESET', text: 'OFFERING RESET' },
  { key: 'OFFERING_FAILED', value: 'OFFERING_FAILED', text: 'OFFERING FAILED' },
  { key: 'ADMINCANCEL', value: 'ADMINCANCEL', text: 'ADMIN CANCEL' },
  { key: 'OFFERING_TERMINATED', value: 'OFFERING_TERMINATED', text: 'OFFERING TERMINATED' },
];

export const PARALLEL_INVESTMENT_OPTIONS = {
  option: {
    value: '',
    values: [
      {
        label: 'Yes',
        labelDescription: <>
          Verify my status as an accredited investor</>,
        value: 'yes',
      },
      {
        label: 'No',
        labelDescription: <>
          Proceed to invest under Regulation Crowdfunding</>,
        value: 'no',
      },
    ],
    // error: undefined,
    // rule: 'required',
    // key: 'role',
  },
};

export const INVESTMENT_SUMMARY_META = [
  {
    label: 'Issuer',
    key: 'shorthandBusinessName',
    value: 'keyTerms.shorthandBusinessName',
    isMobile: true,
    for: ['TERM_NOTE', 'REVENUE_SHARING_NOTE', 'SAFE', 'CONVERTIBLE_NOTES', 'EQUITY', 'REAL_ESTATE', 'FUNDS'],
  },
  {
    label: 'Securities',
    key: 'securities',
    value: 'keyTerms.securities',
    isMobile: true,
    for: ['TERM_NOTE', 'REVENUE_SHARING_NOTE', 'SAFE', 'CONVERTIBLE_NOTES', 'EQUITY', 'REAL_ESTATE', 'FUNDS'],
  },
  {
    label: 'Anticipated Opening Date',
    key: 'expectedOpsDate',
    value: 'offering.launch.expectedOpsDate',
    isMobile: true,
    for: ['TERM_NOTE', 'REVENUE_SHARING_NOTE', 'EQUITY', 'REAL_ESTATE', 'FUNDS'],
  },
  {
    label: 'Investment Multiple',
    key: 'multiple',
    value: 'closureSummary.keyTerms.multiple',
    isMobile: true,
    for: ['REVENUE_SHARING_NOTE'],
  },
  {
    label: 'Annualized Interest Rate',
    key: 'interestRate',
    value: 'keyTerms.interestRate',
    isMobile: true,
    for: ['TERM_NOTE', 'SAFE', 'CONVERTIBLE_NOTES'],
  },
  {
    label: 'Market Cap',
    key: 'valuationCap',
    value: 'keyTerms.valuationCap',
    isMobile: true,
    for: ['SAFE', 'CONVERTIBLE_NOTES'],
  },
  {
    label: 'Discount',
    key: 'discount',
    value: 'keyTerms.discount',
    isMobile: true,
    for: ['SAFE', 'CONVERTIBLE_NOTES'],
  },
  {
    label: '',
    key: 'priceCalculation',
    value: 'closureSummary.keyTerms.priceCalculation',
    isMobile: true,
    for: ['EQUITY'],
  },
  {
    label: 'Pre-Money Valuation',
    key: 'premoneyValuation',
    value: 'keyTerms.premoneyValuation',
    isMobile: true,
    for: ['EQUITY'],
  },
  {
    label: 'Payments',
    key: 'frequencyOfPayments',
    value: 'keyTerms.frequencyOfPayments',
    isMobile: true,
    for: ['TERM_NOTE', 'REVENUE_SHARING_NOTE', 'SAFE', 'CONVERTIBLE_NOTES', 'EQUITY', 'REAL_ESTATE', 'FUNDS'],
  },
  {
    label: 'Revenue Sharing Percentage',
    key: 'revSharePercentage',
    value: 'closureSummary.keyTerms.revSharePercentage',
    isMobile: true,
    for: ['REVENUE_SHARING_NOTE'],
  },
  {
    label: 'Revenue Sharing Percentage Description',
    key: 'revSharePercentageDescription',
    value: 'keyTerms.revSharePercentageDescription',
    isMobile: false,
    for: ['REVENUE_SHARING_NOTE'],
  },
  {
    label: 'Maturity',
    key: 'maturity',
    value: 'keyTerms.maturity',
    isMobile: true,
    tooltip: <>This is the deadline by which the issuer is obligated to make payment in full to investors.</>,
    for: ['TERM_NOTE', 'REVENUE_SHARING_NOTE', 'SAFE', 'CONVERTIBLE_NOTES', 'EQUITY', 'REAL_ESTATE', 'FUNDS'],
  },
  {
    label: 'Maturity Date',
    key: 'maturityDate',
    value: 'closureSummary.keyTerms.maturityDate',
    isMobile: true,
    for: ['SAFE'],
  },
  {
    label: 'Security Interest',
    key: 'securityInterest',
    value: 'keyTerms.securityInterest',
    isMobile: false,
    for: ['TERM_NOTE', 'REVENUE_SHARING_NOTE'],
  },
  {
    label: 'Ownership % Represented by Securities',
    key: 'securitiesOwnershipPercentage',
    value: 'keyTerms.securitiesOwnershipPercentage',
    isMobile: true,
    for: ['TERM_NOTE', 'REVENUE_SHARING_NOTE'],
  },
  {
    label: 'Close Date',
    key: 'hardCloseDate',
    value: 'closureSummary.hardCloseDate',
    isMobile: true,
    for: ['TERM_NOTE'],
  },
];
