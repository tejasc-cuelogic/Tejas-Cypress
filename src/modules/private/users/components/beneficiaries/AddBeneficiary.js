import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Form, Header, Button, Confirm } from 'semantic-ui-react';
import { FormInput, AutoComplete, FormDatePicker } from '../../../../../theme/form/FormElements';
import Helper from '../../../../../helper/utility';

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

  addMoreBeneficiary = (e) => {
    e.preventDefault();
    this.props.userDetailsStore.addMoreBeneficiary();
  }

  toggleConfirm = (e, index) => {
    e.preventDefault();
    this.props.userDetailsStore.toggleBeneficiaryConfirmModal(index);
  }

  removeBeneficiary = () => {
    if (this.props.userDetailsStore.BENEFICIARY_META.fields.length === 1) {
      this.props.history.push(this.props.refLink);
      this.props.userDetailsStore.toggleBeneficiaryConfirmModal(null);
    } else {
      const index = this.props.userDetailsStore.removeBeneficiaryIndex;
      this.props.userDetailsStore.removeBeneficiary(index);
    }
  }

  render() {
    const {
      BENEFICIARY_META,
      beneficiaryEleChange,
      beneficiaryDateChange,
      setAddressFields,
      beneficiaryModal,
    } = this.props.userDetailsStore;
    return (
      <Aux>
        <Form onSubmit={this.submit}>
          {
            BENEFICIARY_META.fields.map((beneficiary, index) => (
              <Aux>
                <Header as="h4">{`Beneficiary ${index + 1}`}</Header>
                <Button color="red" className="ghost-button pull-right" onClick={e => this.toggleConfirm(e, index)}>- Remove beneficiary</Button>
                <div className="field-wrap">
                  <Form.Group widths="equal">
                    {
                      ['firstName', 'lastName'].map(field => (
                        <FormInput
                          key={field}
                          type="text"
                          name={field}
                          fielddata={beneficiary[field]}
                          changed={(e, result) => beneficiaryEleChange(e, result, index)}
                        />
                      ))
                    }
                  </Form.Group>
                  <Form.Group widths="equal">
                    <FormDatePicker
                      type="text"
                      name="dob"
                      fielddata={beneficiary.dob}
                      selected={beneficiary.dob.value}
                      changed={date => beneficiaryDateChange(date, index)}
                    />
                    <FormInput
                      type="text"
                      name="relationship"
                      fielddata={beneficiary.relationship}
                      changed={(e, result) => beneficiaryEleChange(e, result, index)}
                    />
                  </Form.Group>
                  <Header as="h4">Pernament address</Header>
                  <AutoComplete
                    name="residentalStreet"
                    fielddata={beneficiary.residentalStreet}
                    onplaceselected={place => setAddressFields(place, index)}
                    changed={(e, result) => beneficiaryEleChange(e, result, index)}
                  />
                  <Form.Group widths="equal">
                    {
                      ['city', 'state', 'zipCode'].map(field => (
                        <FormInput
                          key={field}
                          type="text"
                          name={field}
                          fielddata={beneficiary[field]}
                          changed={(e, result) => beneficiaryEleChange(e, result, index)}
                        />
                      ))
                    }
                  </Form.Group>
                  <FormInput
                    type="text"
                    name="share"
                    fielddata={beneficiary.share}
                    changed={(e, result) => beneficiaryEleChange(e, result, index)}
                  />
                </div>
              </Aux>
            ))
          }
          {BENEFICIARY_META.fields.length !== 5 ?
            <Button color="violet" className="ghost-button pull-right" onClick={this.addMoreBeneficiary}>+ Add new beneficiary</Button>
          : null
          }
          <Button loading={this.props.uiStore.inProgress} disabled={!BENEFICIARY_META.meta.isValid} color="green">Submit to approval</Button>
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this beneficiary?"
          open={beneficiaryModal}
          onCancel={this.toggleConfirm}
          onConfirm={this.removeBeneficiary}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
