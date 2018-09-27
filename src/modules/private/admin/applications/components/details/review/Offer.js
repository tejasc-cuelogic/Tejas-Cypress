import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Header, Form, Table, Dropdown, Icon, Confirm, Button } from 'semantic-ui-react';
import { FormInput, MaskedInput } from '../../../../../../../theme/form';
import { STRUCTURE_TYPES, PERSONAL_GUARANTEE_TYPES } from '../../../../../../../services/constants/admin/businessApplication';
import ManagerOverview from './ManagerOverview';

@inject('businessAppReviewStore', 'businessAppStore', 'userStore')
@observer
export default class Offer extends Component {
  componentWillMount() {
    this.props.businessAppReviewStore.setFormData('OFFERS_FRM', 'offers');
    this.props.businessAppReviewStore.setFormData('MANAGERS_FRM', 'offers.managerOverview');
  }
  toggleConfirmModal = (e, index) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, 'OFFERS_FRM');
  }
  addNewOffer = (e) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore('OFFERS_FRM', 'offer');
  }
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('OFFERS_FRM');
  }
  submitWithApproval = (form, action) => {
    this.props.businessAppReviewStore.saveReviewForms(form, action);
  }
  render() {
    const {
      OFFERS_FRM, formChangeWithIndex, maskChangeWithIndex, confirmModal,
      confirmModalName, removeData, updateStatuses,
    } = this.props.businessAppReviewStore;
    const offerFields = OFFERS_FRM.fields.offer[0];
    const { roles } = this.props.userStore.currentUser;
    const isManager = roles && roles.includes('manager');
    const { businessApplicationDetailsAdmin } = this.props.businessAppStore;
    const { offers } = businessApplicationDetailsAdmin;
    const submitted = (offers && offers.submitted) ? offers.submitted : null;
    const approved = (offers && offers.approved) ? offers.approved : null;
    const isReadonly = ((submitted && !isManager) || (isManager && approved));
    updateStatuses('offer', submitted, approved);
    return (
      <Aux>
        <Header as="h4">
          Offers
          {!isReadonly && OFFERS_FRM.fields.offer.length < 4 &&
          <Link to={this.props.match.url} className="link pull-right" onClick={this.addNewOffer}><small>+ Add new offer</small></Link>
          }
        </Header>
        <Form onSubmit={this.submit}>
          {offerFields &&
          <Table basic compact singleLine className="form-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                {
                  OFFERS_FRM.fields.offer.map((offer, index) => (
                    <Table.HeaderCell>Offer {String.fromCharCode('A'.charCodeAt() + index)}
                      {!isReadonly &&
                      <Link
                        to={this.props.match.url}
                        onClick={e => this.toggleConfirmModal(e, index)}
                      >
                        <Icon className="ns-close-circle" color="grey" />
                      </Link>
                      }
                    </Table.HeaderCell>
                  ))
                }
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{offerFields.structure.label}</Table.Cell>
                {
                OFFERS_FRM.fields.offer.map((offer, index) => (
                  <Table.Cell>
                    <Dropdown
                      containerclassname={isReadonly ? 'display-only' : ''}
                      disabled={isReadonly}
                      name="structure"
                      placeholder="Choose"
                      fluid
                      selection
                      value={offer.structure.value}
                      options={STRUCTURE_TYPES}
                      fielddata={offer.structure}
                      onChange={(e, result) => formChangeWithIndex(e, result, 'OFFERS_FRM', 'offer', index)}
                    />
                  </Table.Cell>
                ))
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>{offerFields.amount.label}</Table.Cell>
                {
                OFFERS_FRM.fields.offer.map((offer, index) => (
                  <Table.Cell>
                    <FormInput
                      containerclassname={isReadonly ? 'display-only' : ''}
                      disabled={isReadonly}
                      name="amount"
                      fielddata={offer.amount}
                      changed={(e, result) => formChangeWithIndex(e, result, 'OFFERS_FRM', 'offer', index)}
                      ishidelabel
                    />
                  </Table.Cell>
                ))
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>{offerFields.maturity.label}</Table.Cell>
                {
                OFFERS_FRM.fields.offer.map((offer, index) => (
                  <Table.Cell>
                    <MaskedInput
                      containerclassname={isReadonly ? 'display-only' : ''}
                      disabled={isReadonly}
                      name="maturity"
                      fielddata={offer.maturity}
                      changed={(values, field) => maskChangeWithIndex(values, 'OFFERS_FRM', 'offer', field, index)}
                      hidelabel
                      number
                    />
                  </Table.Cell>
                ))
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>{offerFields.interestRate.label}</Table.Cell>
                {
                OFFERS_FRM.fields.offer.map((offer, index) => (
                  <Table.Cell>
                    <MaskedInput
                      containerclassname={isReadonly ? 'display-only' : ''}
                      disabled={isReadonly}
                      name="interestRate"
                      fielddata={offer.interestRate}
                      changed={(values, field) => maskChangeWithIndex(values, 'OFFERS_FRM', 'offer', field, index)}
                      hidelabel
                      percentage
                    />
                  </Table.Cell>
                ))
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>{offerFields.amortizationAmount.label}</Table.Cell>
                {
                OFFERS_FRM.fields.offer.map((offer, index) => (
                  <Table.Cell>
                    <MaskedInput
                      containerclassname={isReadonly ? 'display-only' : ''}
                      disabled={isReadonly}
                      prefix="$"
                      currency
                      name="amortizationAmount"
                      fielddata={offer.amortizationAmount}
                      changed={(values, field) => maskChangeWithIndex(values, 'OFFERS_FRM', 'offer', field, index)}
                      hidelabel
                    />
                  </Table.Cell>
                ))
               }
              </Table.Row>
              <Table.Row>
                <Table.Cell>{offerFields.personalGuarantee.label}</Table.Cell>
                {
                OFFERS_FRM.fields.offer.map((offer, index) => (
                  <Table.Cell>
                    <Dropdown
                      containerclassname={isReadonly ? 'display-only' : ''}
                      disabled={isReadonly}
                      name="personalGuarantee"
                      placeholder="Type number"
                      fluid
                      selection
                      value={offer.personalGuarantee.value}
                      options={PERSONAL_GUARANTEE_TYPES}
                      fielddata={offer.personalGuarantee}
                      onChange={(e, result) => formChangeWithIndex(e, result, 'OFFERS_FRM', 'offer', index)}
                    />
                  </Table.Cell>
                ))
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>{offerFields.businessBlanket.label}</Table.Cell>
                {
                OFFERS_FRM.fields.offer.map((offer, index) => (
                  <Table.Cell>
                    <FormInput
                      containerclassname={isReadonly ? 'display-only' : ''}
                      disabled={isReadonly}
                      name="businessBlanket"
                      fielddata={offer.businessBlanket}
                      changed={(e, result) => formChangeWithIndex(e, result, 'OFFERS_FRM', 'offer', index)}
                      ishidelabel
                    />
                  </Table.Cell>
                ))
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>{offerFields.expirationDate.label}</Table.Cell>
                {
                OFFERS_FRM.fields.offer.map((offer, index) => (
                  <Table.Cell>
                    <MaskedInput
                      containerclassname={isReadonly ? 'display-only' : ''}
                      disabled={isReadonly}
                      name="expirationDate"
                      changed={(values, field) => maskChangeWithIndex(values, 'OFFERS_FRM', 'offer', field, index)}
                      fielddata={offer.expirationDate}
                      format="##-##-####"
                      hidelabel
                      dateOfBirth
                    />
                  </Table.Cell>
                ))
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>{offerFields.multiple.label}</Table.Cell>
                {
                OFFERS_FRM.fields.offer.map((offer, index) => (
                  <Table.Cell>
                    <FormInput
                      containerclassname={isReadonly ? 'display-only' : ''}
                      disabled={isReadonly || offer.structure.value === 'TERM_NOTE'}
                      name="multiple"
                      fielddata={offer.multiple}
                      changed={(e, result) => formChangeWithIndex(e, result, 'OFFERS_FRM', 'offer', index)}
                      ishidelabel
                    />
                  </Table.Cell>
                ))
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>{offerFields.totalCapital.label}</Table.Cell>
                {
                OFFERS_FRM.fields.offer.map((offer, index) => (
                  <Table.Cell>
                    <MaskedInput
                      prefix="$"
                      currency
                      name="totalCapital"
                      fielddata={offer.totalCapital}
                      changed={(values, field) => maskChangeWithIndex(values, 'OFFERS_FRM', 'offer', field, index)}
                      containerclassname={isReadonly ? 'display-only' : ''}
                      disabled={isReadonly || offer.structure.value === 'TERM_NOTE'}
                      hidelabel
                    />
                  </Table.Cell>
                ))
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>Portal agreement upload</Table.Cell>
                <Table.Cell colSpan="4">
                  {!isReadonly &&
                  <Button type="button" size="small" color="blue" className="link-button" >+ Add portal agreement</Button>
                  }
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          }
          {!isManager && !approved &&
          <div className="right-align mt-20">
            <Button.Group>
              {!submitted &&
              <Button disabled={!OFFERS_FRM.meta.isValid} className="relaxed" secondary>Save</Button>
              }
              <Button onClick={() => this.submitWithApproval('OFFERS_FRM', 'REVIEW_SUBMITTED')} disabled={(!(OFFERS_FRM.meta.isValid) || submitted)} primary={!submitted} type="button">{submitted ? 'Awaiting Manager Approval' : 'Submit for Approval'}</Button>
            </Button.Group>
          </div>
          }
          {(submitted || isManager) &&
          <ManagerOverview formName="OFFERS_FRM" approved={approved} isReadonly={isReadonly} isValid={OFFERS_FRM.meta.isValid} />
          }
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this offer?"
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => removeData(confirmModalName, 'offer')}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
