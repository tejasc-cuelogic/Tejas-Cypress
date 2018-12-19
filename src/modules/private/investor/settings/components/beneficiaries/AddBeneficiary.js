import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, withRouter, Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Form, Header, Button, Confirm, Icon } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../../theme/shared';
import { FormInput, AutoComplete, MaskedInput } from '../../../../../../theme/form';
import ConfirmVerificationCode from './ConfirmVerificationCode';
import BeneficiaryShareModal from './BeneficiaryShareModal';
import BeneficiaryPreviewModal from './BeneficiaryPreviewModal';
import { MAX_BENEFICIARY_LIMIT } from '../../../../../../constants/common';

@inject('beneficiaryStore', 'uiStore')
@withRouter
@observer
export default class AddBeneficiary extends Component {
  componentWillMount() {
    this.props.beneficiaryStore.setCurrentSelectedAccountId(this.props.accountId);
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
    const screenUrl = this.props.beneficiaryStore.calculateSharePercentage();
    this.props.beneficiaryStore.setShareModalData(true);
    const location = `${this.props.match.url}/${screenUrl}`;
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
                  <Header as="h5">
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
                      <MaskedInput
                        name="dob"
                        fielddata={beneficiary.dob}
                        format="##/##/####"
                        changed={values => beneficiaryDateChange(values.formattedValue, index)}
                        dateOfBirth
                        showerror
                      />
                      <FormInput
                        type="text"
                        name="relationship"
                        fielddata={beneficiary.relationship}
                        changed={(e, result) => beneficiaryEleChange(e, result, index)}
                      />
                    </Form.Group>
                    <Header as="h6">Permanent address</Header>
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
              <InlineLoader />
          }
          {BENEFICIARY_META.fields.beneficiary.length !== MAX_BENEFICIARY_LIMIT &&
            <Button color="violet" className="ghost-button pull-right" onClick={this.addMoreBeneficiary}>+ Add new beneficiary</Button>
          }
          <Button as={Link} to={this.props.refLink} color="red" >Cancel</Button>
          <Button loading={inProgress} disabled={!BENEFICIARY_META.meta.isValid} color="green">Proceed</Button>
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
        <Route path={`${this.props.match.url}/verify`} render={() => <ConfirmVerificationCode refLink={this.props.refLink} refLinkList={this.props.match.url} />} />
      </Aux>
    );
  }
}
