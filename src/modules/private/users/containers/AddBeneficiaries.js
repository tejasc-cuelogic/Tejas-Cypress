import React, { Component } from 'react';
import { Modal, Header, Divider, Form, Button } from 'semantic-ui-react';

export default class AddBeneficiaries extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="small" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Add  new beneficiary</Header>
          <Divider />
          <p>Complete form and submit beneficiary ID to the approval</p>
        </Modal.Header>
        <Modal.Content>
          <Header as="h3">Beneficiary personal info</Header>
          <Form error onSubmit={this.handleSubmitInvestorDetails}>
            <Form.Group widths="equal">
              <Form.Input fluid label="First name" placeholder="First name" />
              <Form.Input fluid label="Last name" placeholder="Last name" />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input fluid label="Date of Birth" placeholder="DD-MM-YYYY" />
              <Form.Input fluid label="Relationship to Account Holder" placeholder="Relationship to Account Holder" />
            </Form.Group>
            <Header as="h3">Permenant Address</Header>
            <Form.Input fluid label="Residendial Street" placeholder="Baker Street 221B" />
            <Form.Group widths="equal">
              <Form.Input fluid label="City" placeholder="New York" />
              <Form.Input fluid label="State" placeholder="NY" />
              <Form.Input fluid label="ZIP code" placeholder="10012" />
            </Form.Group>
            <div className="center-align">
              <Button size="large" color="green" className="very relaxed">Submit to approval</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
