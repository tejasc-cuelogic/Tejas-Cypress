import React from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Popup, List } from 'semantic-ui-react';


export const INVESTMENT_INFO = {
  investmentAmount: {
    label: 'Investment Amount',
    key: 'investmentAmount',
    value: '',
    error: undefined,
    customErrors: {
      required: '* required.',
    },
    rule: 'required',
    placeHolder: '$0',
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

export const AGREEMENT_DETAILS_INFO = {
  netWorth: {
    placeHolder: '$ 0',
    value: '500',
    label: 'Net Worth',
    error: undefined,
    rule: 'optional',
    tooltip: (<Aux>You can see how to calculate your net worth <a href="">here</a>.</Aux>),
  },
  annualIncome: {
    error: undefined,
    rule: 'optional',
    placeHolder: '$ 0',
    value: '500',
    label: 'Annual Income',
    tooltip: (
      <Aux>
        You can include ancillary sources of income (including from side jobs,
        rental income and capital gains) and your spouse’s income.
      </Aux>),
  },
  OtherRegCfInvestments: {
    error: undefined,
    rule: 'optional',
    placeHolder: '$ 0',
    value: '500',
    label: 'Other Reg CF Investments',
    tooltip: (
      <Aux>
        Other Regulation Crowdfunding investments made in other platforms. Note: This does
        not include any donation/rewards crowdfunding platforms (e.g. Kickstarter) or investments
        made in offerings under other sets of regulations (e.g. Reg D, Reg A). If you have any
        questions about what constitutes other crowdfunding investments, please
        contact <a href="/">support@nextseed.com</a>
      </Aux>),
  },
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
        label: 'I understand that investing in securities sold in reliance on Regulation Crowdfunding involves risks and I should not invest any funds unless I can afford to lose the entire amount.', value: '3',
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
          <Aux>
            I confirm that I am complying with my <b>annual investment limit</b> (<a href="/">update</a>)
          </Aux>
        ),
        value: '4',
      },
    ],
    error: undefined,
    rule: 'array',
  },
  checkboxesRight: {
    value: [],
    values: [
      {
        label: (
          <Aux>
            I have reviewed and agree to the terms of the <Link to="doc-sign">Note Purchase Agreement</Link>.
          </Aux>
        ),
        value: '5',
      },
      {
        label: (
          <Aux>
            I have reviewed NextSeed’s <a href="/">educational materials</a>, understand that
            the entire amount of my investment may be lost, and confirm that I am in a
            financial condiiton to bear the loss. I have read and agree to the terms of
            the <a href="/">CrowdPay Custodial Account Agreement</a>,
            the <a href="/">Substitute IRS Form W-9 Certificaiton</a>,
            and <a href="/">NextSeed Investor Membership Agreement</a>.
          </Aux>
        ),
        value: '6',
      },
    ],
    error: undefined,
    rule: 'array',
  },
};

export const INVESTMENT_LIMITS = {
  netWorth: {
    value: '',
    label: 'Net Worth',
    error: undefined,
    rule: 'numeric|required',
  },
  annualIncome: {
    value: '',
    label: 'Annual Income',
    error: undefined,
    rule: 'numeric|required',
  },
  cfInvestments: {
    value: '',
    label: 'Other Reg CF Investments:',
    error: undefined,
    rule: 'numeric|required',
  },
};
