import React from 'react';
import Aux from 'react-aux';
import { Header, List } from 'semantic-ui-react';

const GeneralConditions = () => (
  <Aux>
    <Header as="h4">Offer A Issuer Conditions</Header>
    <p>In order to successfully launch your crowdfunding campaign, please be advised
    that we will need to complete certain steps as described below with your
    cooperation. The documents / information requested must be received in a timely
    manner for the offering to launch by Campaign Approval Expiration Date or we may
    be unable to continue your campaign launch preparation.
    </p>
    <List relaxed bulleted className="mt-40 mb-30">
      <List.Item>
        <List.Content>
          <b>Satisfactory Legal Diligence</b> — you will need to provide certain background
          information about the business and control persons. We perform a Bad Actor Check
          to verify your eligibility to launch a crowdfunding campaign.
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content><b>Regulatory Filings</b> — you will need to execute necessary regulatory
          documentation (Form ID, Form C, and any applicable state filings) with our assistance.
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content><b>Escrow Documentation</b> — you will need to execute documents required
          by our partner bank, GoldStar Trust Company.
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content><b>Campaign Creation materials</b> — you will need to provide the
          appropriate media files and information about your business for us to build
          your offering page content.
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content><b>Legally Required Disclosures under Reg CF</b> — you will need to
          provide information described in Section 3 of this Letter.
        </List.Content>
      </List.Item>
    </List>
  </Aux>
);

export default GeneralConditions;
