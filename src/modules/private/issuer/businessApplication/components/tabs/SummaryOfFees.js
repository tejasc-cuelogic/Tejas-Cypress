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
            banking partner, <b className="primary-two-text">GoIdStar Trust Company</b>  to open an escrow account for you to
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
    <List relaxed bulleted className="mt-40 mb-30">
      <List.Item>
        <List.Content><b className="primary-two-text">0 Total § Raised &lt; $500K </b>
        : 5% of funds from Group A &amp; 10% of funds from Group B;
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content><b className="primary-two-text">0 $500k 3 Total § Raised &lt; $750K </b>
        : 5% of funds from Group A &amp; 9% of funds from Group B; and
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content><b className="primary-two-text">0 $750k 3 Total § Raised </b>
        : 5% of funds from Group A and 8% of funds from Group B.
        </List.Content>
      </List.Item>
    </List>
    <p>
      <b>
      Repeat issuers will get a reduced rate of 7% of funds
      from Group B regardless of the amount raised.
      </b>
    </p>
    <p>
    Example: If you have successfully fundraised $750K from your crowdfunding campaign,
    of which $250K are contributed by investors from your social network
    (NextSeed will provide tracking) and the rest contributed by investors sourced by NextSeed,
    the total fee payable to NextSeed will be: 5% x $250K + 9% x $500K = $57.5K (or 7.7% of $750K).
    </p>
  </Aux>
);

export default GeneralConditions;
