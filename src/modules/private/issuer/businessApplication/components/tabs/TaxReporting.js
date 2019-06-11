import React from 'react';
import Aux from 'react-aux';
import { Header } from 'semantic-ui-react';

const GeneralConditions = () => (
  <Aux>
    <Header as="h4">Tax reporting related service provided by Nextseed</Header>
    <p>
From the closing of your crowdfunding campaign to Maturity, your investors will receive
      relevant tax forms horn NextSeed  and GoldStar related to Me interest income they receive
      each calendar year. We provide investors with 1.099-IIT and 1099-B forms, as applicable,
      by the deadline of January, 31th of the following year. Your investors will correspond
      with NextSeed  directly (rather than you with respect to these tax forms.
    </p>
    <p>
During the same period, we will also provide you with year-end summary statement that
      includes (1) total payment made,  (2) total principal repayment made, and (3) total
      interest payment made for the calendar year. You can provide this  information to your
      accountant for your tax filings.
    </p>
    <p>
      <b>If you are considering a revenue sharing structure:</b>
      <br />
      Under the Internal Revenue Code, you agree to file a statement with your federal income tax
      return classifying the revenue sharing note as debt. For more information, please seek advice
      from your tax accountant.
    </p>
    <p>
For other types of deals, K-1 or other forms will be provided in lieu of 1099 forms
      as applicable.
    </p>
  </Aux>
);

export default GeneralConditions;
