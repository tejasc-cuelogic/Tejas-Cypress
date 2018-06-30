import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Divider, Form, Button } from 'semantic-ui-react';
import { FormInput, AutoComplete, FormDatePicker } from '../../../../../../theme/form';
import Helper from '../../../../../../helper/utility';

@inject('userDetailsStore', 'uiStore')
@observer
export default class AddBeneficiary extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }

  submit = (e) => {
    e.preventDefault();
    this.props.userDetailsStore.createBeneficiary().then(() => {
      Helper.toast('Beneficiary added!', 'success');
      this.props.history.push(this.props.refLink);
    });
  }

  render() {
    const {
      BENEFICIARY_META, beneficiaryEleChange, beneficiaryDateChange, setAddressFields,
    } = this.props.userDetailsStore;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="small" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Add  new beneficiary</Header>
          <Divider />
          <p>Complete form and submit beneficiary ID to the approval</p>
        </Modal.Header>
        <Modal.Content>
          <Header as="h3">Beneficiary personal info</Header>
          <Form onSubmit={this.submit}>
            <Form.Group widths="equal">
              {
                ['firstName', 'lastName'].map(field => (
                  <FormInput
                    key={field}
                    type="text"
                    name={field}
                    fielddata={BENEFICIARY_META.fields[field]}
                    changed={beneficiaryEleChange}
                  />
                ))
              }
            </Form.Group>
            <Form.Group widths="equal">
              <FormDatePicker
                type="text"
                name="dob"
                fielddata={BENEFICIARY_META.fields.dob}
                selected={BENEFICIARY_META.fields.dob.value}
                changed={beneficiaryDateChange}
              />
              <FormInput
                type="text"
                name="relationship"
                fielddata={BENEFICIARY_META.fields.relationship}
                changed={beneficiaryEleChange}
              />
            </Form.Group>
            <AutoComplete
              name="residentalStreet"
              fielddata={BENEFICIARY_META.fields.residentalStreet}
              onplaceselected={setAddressFields}
              changed={beneficiaryEleChange}
            />
            <Form.Group widths="equal">
              {
                ['city', 'state', 'zipCode'].map(field => (
                  <FormInput
                    key={field}
                    type="text"
                    name={field}
                    fielddata={BENEFICIARY_META.fields[field]}
                    changed={beneficiaryEleChange}
                  />
                ))
              }
            </Form.Group>
            <div className="center-align">
              <Button loading={this.props.uiStore.inProgress} disabled={!BENEFICIARY_META.meta.isValid} size="large" color="green" className="very relaxed">Submit to approval</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
