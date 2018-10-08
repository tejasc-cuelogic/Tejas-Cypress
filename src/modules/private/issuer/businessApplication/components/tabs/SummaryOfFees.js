import React from 'react';
import Aux from 'react-aux';
import { Header, List } from 'semantic-ui-react';

const GeneralConditions = () => (
  <Aux>
    <Header as="h4">Summary of related expenses</Header>
    <p>We strive to be the biggest advocate of your business - NextSeed does not charge any
      fees until your crowdfunding campaign has successfully delivered your fundraising goals.
      Having said that, you should expect to incur three types of expenses once you have
      decided to pursue a crowdfunding campaign:
    </p>
    <List relaxed bulleted className="mt-40 mb-30">
      <List.Item>
        <List.Content>
          <b>Escrow Account Setup</b> — there is a one-time $500 fee payable to NextSeed{"'"}s
            banking partner, GoIdStar Trust Company  to open an escrow account for you to
            receive investor{"'"}s funds; and control persons. We perform a Bad Actor Check to
            verify your eligibility to launch a crowdfunding campaign.
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content><b>Financial Statements</b> — (for the last two years, as applicable)
          reviewed by a Certiﬁed Public Accountant: crowdfunding campaigns seeking to fundraise more
          than $107,000 are required to provide CPA-reviewed financial statements on their campaign
          under Reg CF; and
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content><b>Marketing Collateral</b> — professional photos, architecture renderings,
          floor plans/drawings, and/or videos are critical to the success of your crowdfunding
          campaigns. Our team will request these collaterals from you during the preparation.
        </List.Content>
      </List.Item>
    </List>
    <p>Upon the successful closing of your campaign, we will settle NextSeed’s service fee with
      you. The agreed service fee will then be withdrawn from your escrow account at the time your
      funds are released. NextSeed charges fees in two tiers based on the capital sources:
      investors from the issuer’s network (Group A) vs. investors sourced by NextSeed (Group B).
    </p>
  </Aux>
);

export default GeneralConditions;
