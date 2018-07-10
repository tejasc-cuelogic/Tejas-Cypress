import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import moment from 'moment';
import { Form, Header, Button, Confirm, Icon } from 'semantic-ui-react';
import { FormInput, AutoComplete, FormDatePicker } from '../../../../../../theme/form';
import ConfirmVerificationCode from './ConfirmVerificationCode';
import BeneficiaryShareModal from './BeneficiaryShareModal';
import BeneficiaryPreviewModal from './BeneficiaryPreviewModal';

@inject('beneficiaryStore', 'uiStore')
@withRouter
@observer
export default class AddBeneficiary extends Component {
  componentWillMount() {
    this.props.beneficiaryStore.setCurrentSelectedAccountId(this.props.accountId);
    // const location = `${this.props.match.url}/verify`;
    // if (this.props.location.pathname
    //   !== location && !this.props.beneficiaryStore.isShareModalDataSet) {
    //   this.props.beneficiaryStore.beneficiaryReset();
    // }
    // if (this.props.isDataAvailable &&
    //   this.props.location.pathname !== location
    //   && !this.props.beneficiaryStore.isShareModalDataSet) {
    //   this.props.beneficiaryStore.setBeneficiariesInfo();
    // }
    if (!this.props.beneficiaryStore.isShareModalDataSet) {
      this.props.beneficiaryStore.beneficiaryReset();
    }
    if (this.props.isDataAvailable && !this.props.beneficiaryStore.isShareModalDataSet) {
      this.props.beneficiaryStore.setBeneficiariesInfo();
    }
    if (this.props.match.url === this.props.location.pathname) {
      this.props.beneficiaryStore.setShareModalData(false);
    }
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }

  submit = (e) => {
    e.preventDefault();
    this.props.beneficiaryStore.setShareModalData(true);
    const location = `${this.props.match.url}/confirm`;
    this.props.history.push(location);
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
    this.props.beneficiaryStore.removeBeneficiary();
  }

  render() {
    const { inProgress } = this.props.uiStore;
    const {
      BENEFICIARY_META,
      beneficiaryEleChange,
      beneficiaryDateChange,
      setAddressFields,
      beneficiaryModal,
    } = this.props.beneficiaryStore;
    return (
      <Aux>
        <Form onSubmit={this.submit}>
          {
            BENEFICIARY_META.fields.beneficiary.length ?
              BENEFICIARY_META.fields.beneficiary.map((beneficiary, index) => (
                <Aux>
                  <Header as="h4">
                    {`Beneficiary ${index + 1}`}
                    {BENEFICIARY_META.fields.beneficiary.length > 1 &&
                      <Button icon className="link-button pull-right" onClick={e => this.toggleConfirm(e, index)}>
                        <Icon color="red" size="small" className="ns-trash" />
                      </Button>
                    }
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
                  </div>
                </Aux>
              )) :
              <p>loading...</p>
          }
          {BENEFICIARY_META.fields.beneficiary.length !== 5 ?
            <Button color="violet" className="ghost-button pull-right" onClick={this.addMoreBeneficiary}>+ Add new beneficiary</Button>
          : null
          }
          <Button loading={inProgress} disabled={!BENEFICIARY_META.meta.isValid} color="green">Proceed</Button>
          <Button inverted color="green" onClick={this.handleCloseModal} >Cancel</Button>
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
        <Route path={`${this.props.match.url}/confirm`} render={() => <BeneficiaryShareModal refLink={this.props.match.url} />} />
        <Route path={`${this.props.match.url}/preview`} render={() => <BeneficiaryPreviewModal refLink={this.props.match.url} />} />
        <Route path={`${this.props.match.url}/verify`} render={() => <ConfirmVerificationCode refLink={this.props.refLink} />} />
      </Aux>
    );
  }
}
