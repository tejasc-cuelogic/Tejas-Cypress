import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import moment from 'moment';
import { Form, Header, Button, Confirm, Icon, Message } from 'semantic-ui-react';
import { FormInput, AutoComplete, FormDatePicker } from '../../../../../../theme/form';
import ConfirmVerificationCode from './ConfirmVerificationCode';

@inject('beneficiaryStore', 'uiStore')
@withRouter
@observer
export default class AddBeneficiary extends Component {
  componentWillMount() {
    this.props.beneficiaryStore.setCurrentSelectedAccountId(this.props.accountId);
    const location = `${this.props.match.url}/confirm`;
    if (this.props.location.pathname !== location) {
      this.props.beneficiaryStore.beneficiaryReset();
    }
    if (this.props.isDataAvailable && this.props.location.pathname !== location) {
      this.props.beneficiaryStore.setBeneficiariesInfo();
    }
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }

  submit = (e) => {
    e.preventDefault();
    this.props.beneficiaryStore.resetFormData('OTP_VERIFY_META');
    this.props.beneficiaryStore.requestOtpForManageBeneficiary().then(() => {
      const location = `${this.props.match.url}/confirm`;
      this.props.history.push(location);
    });
  }

  addMoreBeneficiary = (e) => {
    e.preventDefault();
    this.props.beneficiaryStore.addMoreBeneficiary();
  }

  toggleConfirm = (e, index) => {
    e.preventDefault();
    this.props.beneficiaryStore.toggleBeneficiaryConfirmModal(index);
  }

  removeBeneficiary = () => {
    if (this.props.beneficiaryStore.BENEFICIARY_META.fields.beneficiary.length === 1) {
      // this.props.history.push(this.props.refLink);
      this.props.beneficiaryStore.toggleBeneficiaryConfirmModal(null);
    } else {
      const index = this.props.beneficiaryStore.removeBeneficiaryIndex;
      this.props.beneficiaryStore.removeBeneficiary(index);
    }
  }

  render() {
    const { inProgress } = this.props.uiStore;
    const {
      BENEFICIARY_META,
      beneficiaryEleChange,
      beneficiaryDateChange,
      setAddressFields,
      beneficiaryModal,
      removeBeneficiaryMessage,
    } = this.props.beneficiaryStore;
    const showError = BENEFICIARY_META.fields.beneficiary.length ?
      BENEFICIARY_META.fields.beneficiary[0].share.error : false;
    return (
      <Aux>
        {showError &&
          <Message error>
            <Icon name="warning circle" />
            The sum of percentages must be 100
          </Message>
        }
        <Form onSubmit={this.submit}>
          {
            BENEFICIARY_META.fields.beneficiary.length ?
              BENEFICIARY_META.fields.beneficiary.map((beneficiary, index) => (
                <Aux>
                  <Header as="h4">
                    {`Beneficiary ${index + 1}`}
                    <Button icon className="link-button pull-right" onClick={e => this.toggleConfirm(e, index)}>
                      <Icon color="red" size="small" className="ns-trash" />
                    </Button>
                  </Header>
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
                        selected={beneficiary.dob.value ?
                          moment(beneficiary.dob.value) : null}
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
                    <Header as="h4">Shares</Header>
                    <FormInput
                      type="text"
                      name="share"
                      fielddata={beneficiary.share}
                      changed={(e, result) => beneficiaryEleChange(e, result, index)}
                    />
                  </div>
                </Aux>
              )) :
              <p>loading...</p>
          }
          {BENEFICIARY_META.fields.beneficiary.length !== 5 ?
            <Button color="violet" className="ghost-button pull-right" onClick={this.addMoreBeneficiary}>+ Add new beneficiary</Button>
          : null
          }
          <Button loading={inProgress} disabled={!BENEFICIARY_META.meta.isValid} color="green">Submit to approval</Button>
        </Form>
        <Confirm
          header="Confirm"
          content={removeBeneficiaryMessage}
          open={beneficiaryModal}
          onCancel={this.toggleConfirm}
          onConfirm={this.removeBeneficiary}
          size="mini"
          className="deletion"
        />
        <Route path={`${this.props.match.url}/confirm`} render={() => <ConfirmVerificationCode refLink={this.props.refLink} />} />
      </Aux>
    );
  }
}
