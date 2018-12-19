/* eslint-disable max-len */
/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Divider, List } from 'semantic-ui-react';

const PrivacyPolicy = () => (
  <Aux>
    <Header as="h2">NextSeed Securities, LLC<br />Privacy Policy</Header>
    <p>Last updated: Junuary 2018</p>
    <Divider section />
    <div className="justify-text">
      <p>
        When you use NextSeed Securities, LLC (“we,” “us,” “our”) as your broker/dealer,
        you entrust us not only with your hard-earned assets but also with your personal
        and financial data.  We consider your data to be private and confidential, and we
        hold ourselves to the highest standards of trust in their safekeeping and use.
      </p>
      <Divider hidden />
      <p>
        We collect non-public personal information about NextSeed Securities, LLC
        clients such as you, from the following sources:
      </p>
      <Divider hidden />
      <List relaxed as="ul" bulleted>
        <List.Item>Information we receive from you on applications or other forms; and</List.Item>
        <List.Item>Information about your transactions with us, our affiliates, or others.</List.Item>
      </List>
      <Divider hidden />
      <p>
        We do not disclose any non-public personal information about our customers or
        former customers to anyone, except for our everyday business purposes such as
        to process transactions, maintain account(s), respond to court orders and legal
        investigations, report to credit bureaus and as permitted by law.  Otherwise, we
        will not release information about our customers or former customers unless one
        of the following conditions is met:
      </p>
      <Divider hidden />
      <List relaxed as="ul" bulleted>
        <List.Item>We receive your prior written consent;</List.Item>
        <List.Item>We believe the recipient to be you or your authorized representative; or</List.Item>
        <List.Item>We are required by law to release information to the recipient.</List.Item>
      </List>
      <Divider hidden />
      <p>
        We only use information about you and your account to help us better serve your
        investment needs or to suggest services or educational materials that may be of
        interest to you.
      </p>
      <Divider hidden />
      <Header as="h5">CONFIDENTIALITY AND SECURITY</Header>
      <p>
        We maintain physical, electronic and procedural safeguards to guard your personal
        account information. We also restrict access to your personal and financial data
        to authorized NextSeed Securities, LLC associates, or to affiliated or
        non-affiliated business for our everyday business purposes described above, who
        have a need for these records.  We require all nonaffiliated organizations with
        access to your non-public personal information to conform to our privacy standards,
        and they are contractually obligated to keep the information provided confidential
        and used only as requested.  Furthermore, we will continue to adhere to the privacy
        policies and practices described in this notice even after your account is closed or
        becomes inactive.
      </p>
      <p>
        We will continue to conduct our business in a manner that conforms with our pledge
        to you, your expectations and all applicable laws.  If you have questions about
        this Privacy Policy, please contact us at{' '}
        <Link className="positive-text" to="/agreements/legal/privacy-policy">privacy@nextseedsecurities.com.</Link>
      </p>
    </div>
  </Aux>
);

export default PrivacyPolicy;
