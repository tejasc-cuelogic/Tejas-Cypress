import React, { Component } from 'react';
import { Modal, Header, Card, Menu } from 'semantic-ui-react';

export default class ChangePassword extends Component {
  render() {
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="large" closeOnDimmerClick={false}>
        <Modal.Content>
          <Header as="h4">Choose from campaign offers</Header>
          <p>Please read more about offer details and choose one to sign in and proceed.</p>
          <p>You have one month from the date of this Approval Letter to accept your Approved
            Terms before they expire. You may accept by circling the preferred Option above and
            signing the Portal Agreement to formalize our partnership and initiate the preparation
            of your crowdfunding campaign.
          </p>
          <Header as="h3">Offer cards will go here</Header>
          <Card fluid>
            <Menu inverted>
              <Menu.Item>General Conditions</Menu.Item>
              <Menu.Item>Summary of Fees</Menu.Item>
              <Menu.Item>Tax Reporting</Menu.Item>
              <Menu.Item>Payment Chart</Menu.Item>
              <Menu.Item header position="right">Offer A</Menu.Item>
            </Menu>
            <div className="inner-content-spacer">
              <Header as="h4">Offer A Issuer Conditions</Header>
              <p>In order to successfully launch your crowdfunding campaign, please be advised
                that we will need to complete certain steps as described below with your
                cooperation. The documents / information requested must be received in a timely
                manner for the offering to launch by Campaign Approval Expiration Date or we may
                be unable to continue your campaign launch preparation.
              </p>
            </div>
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}
