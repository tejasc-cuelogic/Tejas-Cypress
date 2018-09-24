import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Header, Form, Table, Dropdown, Icon, Confirm, Button } from 'semantic-ui-react';
import { FormInput, MaskedInput } from '../../../../../../../theme/form';
import { STRUCTURE_TYPES, PERSONAL_GUARANTEE_TYPES } from '../../../../../../../services/constants/admin/businessApplication';
import ManagerOverview from './ManagerOverview';

@inject('businessAppReviewStore')
@observer
export default class Offer extends Component {
  componentWillMount() {
    this.props.businessAppReviewStore.setFormData('OFFERS_FRM', 'offers');
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
  render() {
    const {
      OFFERS_FRM,
      OFFER_MANAGER_FRM,
      formChangeWithIndex,
      maskChangeWithIndex,
      confirmModal,
      confirmModalName,
      removeData,
    } = this.props.businessAppReviewStore;
    const offerFields = OFFERS_FRM.fields.offer[0];
    return (
      <Aux>
        <Header as="h4">
          Offers
          {OFFERS_FRM.fields.offer.length < 4 &&
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
                      <Link
                        to={this.props.match.url}
                        onClick={e => this.toggleConfirmModal(e, index)}
                      >
                        <Icon className="ns-close-circle" color="grey" />
                      </Link>
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
                      name="multiple"
                      fielddata={offer.multiple}
                      changed={(e, result) => formChangeWithIndex(e, result, 'OFFERS_FRM', 'offer', index)}
                      disabled={offer.structure.value === 'TERM_NOTE'}
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
                      disabled={offer.structure.value === 'TERM_NOTE'}
                      hidelabel
                    />
                  </Table.Cell>
                ))
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>Portal agreement upload</Table.Cell>
                <Table.Cell colSpan="4">
                  <Button type="button" size="small" color="blue" className="link-button" >+ Add portal agreement</Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          }
          <div className="right-align mt-20">
            <Button.Group>
              <Button
                disabled={!(OFFERS_FRM.meta.isValid && OFFERS_FRM.fields.offer.length)}
                className="relaxed"
                secondary
              >
                Save
              </Button>
              <Button disabled={!(OFFERS_FRM.meta.isValid && OFFERS_FRM.fields.offer.length)} primary type="button">Submit for Approval</Button>
            </Button.Group>
          </div>
          <ManagerOverview form={OFFER_MANAGER_FRM} formName="OFFER_MANAGER_FRM" />
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
