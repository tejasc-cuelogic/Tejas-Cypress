import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Icon, Form, Divider, Input, Popup } from 'semantic-ui-react';

const investorPersonalDetails = props => (
  <Modal size="tiny" open>
    <Modal.Header className="center-align signup-header">
      <Link to="" onClick={() => props.setAuthWizardStep('investorSignup')} className="back-link"><Icon name="arrow left" /></Link>
      <Header as="h2">Hello James!</Header>
      <p>You’re almost at your personal dashboard</p>
      <Divider />
      <p><Link to="">Federal regulations</Link> require us to collect some more info
        to enable you to fully use your account
      </p>
    </Modal.Header>
    <Modal.Content className="signup-content">
      <Form error onSubmit={this.handleSubmitForm}>
        <Form.Group widths="equal">
          <Form.Field>
            {/* eslint-disable */}
            <label>
              First Legal Name
              <Popup
                trigger={<Icon name="help circle outline" />}
                content="Put your first name as listed on your driver license"
                position="top center"
                className="center-align"
              />
            </label>
            <Input
              fluid
              placeholder="John"
              name="first-legal-name"
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            {/* eslint-disable */}
            <label>
              Last Legal Name
              <Popup
                trigger={<Icon name="help circle outline" />}
                content="Put your last name as listed on your driver license"
                position="top center"
                className="center-align"
              />
            </label>
            <Input
              fluid
              placeholder="Smith"
              name="last-legal-name"
              onChange={this.handleInputChange}
            />
          </Form.Field>
        </Form.Group>
        <Form.Field>
          {/* eslint-disable */}
          <label>
            Residental Street
            <Popup
              trigger={<Icon name="help circle outline" />}
              content="Put your residental address as listed on your driver license"
              position="top center"
              className="center-align"
            />
          </label>
          <Input
            fluid
            placeholder="Bakers Street 221/8"
            name="residental-street"
            onChange={this.handleInputChange}
          />
        </Form.Field>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="City"
            placeholder="New York"
            name="city"
            onChange={this.handleInputChange}
          />
          <Form.Input
            fluid
            label="State"
            placeholder="NY"
            name="state"
            onChange={this.handleInputChange}
          />
          <Form.Input
            fluid
            label="Zip Code"
            placeholder="12487"
            name="zip-code"
            onChange={this.handleInputChange}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Phone Number"
            placeholder="123-456-7890"
            name="phone"
            onChange={this.handleInputChange}
          />
          <Form.Input
            fluid
            label="Date of Birth"
            placeholder="24/11/1991"
            name="dob"
            onChange={this.handleInputChange}
          />
        </Form.Group>
        <Form.Input
          fluid
          label="SSN"
          placeholder="123-456-7890"
          name="ssn"
          onChange={this.handleInputChange}
        />
        <div className="center-align">
          <Button circular color="green" size="large" onClick={() => props.setAuthWizardStep('InvestmentChooseType')}>Confirm</Button>
        </div>
        <div className="center-align">
          <Link to="" className="cancel-link">I’ll finish this later</Link>
        </div>
      </Form>
    </Modal.Content>
  </Modal>
);

export default investorPersonalDetails;
