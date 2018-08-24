import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Header, Form, Table, Dropdown, Icon, Confirm, Button, Divider } from 'semantic-ui-react';
import { FormInput, MaskedInput, FormTextarea } from '../../../../../../../theme/form';
import { STRUCTURE_TYPES, PERSONAL_GUARANTEE_TYPES } from '../../../../../../../services/constants/admin/businessApplication';
@inject('businessAppReviewStore')
@observer
export default class Offer extends Component {
  toggleConfirmModal = (e, index) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, 'OFFERS_FRM');
  }
  addNewOffer = (e) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore('OFFERS_FRM');
  }
  render() {
    const {
      OFFERS_FRM,
      MANAGERS_FRM,
      formChangeWithIndex,
      maskChangeWithIndex,
      confirmModal,
      confirmModalName,
      formChange,
      removeData,
    } = this.props.businessAppReviewStore;
    const offerFields = OFFERS_FRM.fields.data[0];
    return (
      <div className="inner-content-spacer">
        <Header as="h4">
          Offers
          {OFFERS_FRM.fields.data.length < 4 &&
          <Link to={this.props.match.url} className="link pull-right" onClick={e => this.addNewOffer(e)}><small>+ Add new offer</small></Link>
          }
        </Header>
        <Form>
          <Table basic compact singleLine className="form-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                {
                  OFFERS_FRM.fields.data.map((offer, index) => (
                    <Table.HeaderCell>Offer {String.fromCharCode('A'.charCodeAt() + index)}
                      {index !== 0 &&
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
                OFFERS_FRM.fields.data.map((offer, index) => (
                  <Table.Cell>
                    <Dropdown
                      name="structure"
                      placeholder="Choose"
                      fluid
                      selection
                      options={STRUCTURE_TYPES}
                      fielddata={offer.structure}
                      onChange={(e, result) => formChangeWithIndex(e, result, 'OFFERS_FRM', index)}
                    />
                  </Table.Cell>
                ))
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>{offerFields.offeringAmount.label}</Table.Cell>
                {
                OFFERS_FRM.fields.data.map((offer, index) => (
                  <Table.Cell>
                    <FormInput
                      name="offeringAmount"
                      fielddata={offer.offeringAmount}
                      changed={(e, result) => formChangeWithIndex(e, result, 'OFFERS_FRM', index)}
                      ishidelabel
                    />
                  </Table.Cell>
                ))
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>{offerFields.maturity.label}</Table.Cell>
                {
                OFFERS_FRM.fields.data.map((offer, index) => (
                  <Table.Cell>
                    <MaskedInput
                      name="maturity"
                      fielddata={offer.maturity}
                      changed={(values, field) => maskChangeWithIndex(values, 'OFFERS_FRM', field, index)}
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
                OFFERS_FRM.fields.data.map((offer, index) => (
                  <Table.Cell>
                    <MaskedInput
                      name="interestRate"
                      fielddata={offer.interestRate}
                      changed={(values, field) => maskChangeWithIndex(values, 'OFFERS_FRM', field, index)}
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
                OFFERS_FRM.fields.data.map((offer, index) => (
                  <Table.Cell>
                    <MaskedInput
                      prefix="$"
                      currency
                      name="amortizationAmount"
                      fielddata={offer.amortizationAmount}
                      changed={(values, field) => maskChangeWithIndex(values, 'OFFERS_FRM', field, index)}
                      hidelabel
                    />
                  </Table.Cell>
                ))
               }
              </Table.Row>
              <Table.Row>
                <Table.Cell>{offerFields.personalGuarantee.label}</Table.Cell>
                {
                OFFERS_FRM.fields.data.map((offer, index) => (
                  <Table.Cell>
                    <Dropdown
                      name="personalGuarantee"
                      placeholder="Type number"
                      fluid
                      selection
                      options={PERSONAL_GUARANTEE_TYPES}
                      fielddata={offer.personalGuarantee}
                      onChange={(e, result) => formChangeWithIndex(e, result, 'OFFERS_FRM', index)}
                    />
                  </Table.Cell>
                ))
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>{offerFields.businessBlanket.label}</Table.Cell>
                {
                OFFERS_FRM.fields.data.map((offer, index) => (
                  <Table.Cell>
                    <FormInput
                      name="businessBlanket"
                      fielddata={offer.businessBlanket}
                      changed={(e, result) => formChangeWithIndex(e, result, 'OFFERS_FRM', index)}
                      ishidelabel
                    />
                  </Table.Cell>
                ))
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>{offerFields.expirationDate.label}</Table.Cell>
                {
                OFFERS_FRM.fields.data.map((offer, index) => (
                  <Table.Cell>
                    <MaskedInput
                      name="expirationDate"
                      changed={(values, field) => maskChangeWithIndex(values, 'OFFERS_FRM', field, index)}
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
                <Table.Cell>{offerFields.multipleOnPrincipalToPay.label}</Table.Cell>
                {
                OFFERS_FRM.fields.data.map((offer, index) => (
                  <Table.Cell>
                    <FormInput
                      name="multipleOnPrincipalToPay"
                      fielddata={offer.multipleOnPrincipalToPay}
                      changed={(e, result) => formChangeWithIndex(e, result, 'OFFERS_FRM', index)}
                      disabled={offer.structure.value === 'termnote'}
                      ishidelabel
                    />
                  </Table.Cell>
                ))
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>{offerFields.totalCapitalReturned.label}</Table.Cell>
                {
                OFFERS_FRM.fields.data.map((offer, index) => (
                  <Table.Cell>
                    <MaskedInput
                      prefix="$"
                      currency
                      name="totalCapitalReturned"
                      fielddata={offer.totalCapitalReturned}
                      changed={(values, field) => maskChangeWithIndex(values, 'OFFERS_FRM', field, index)}
                      disabled={offer.structure.value === 'termnote'}
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
          <div className="right-align mt-20">
            <Button.Group>
              <Button
                disabled={!OFFERS_FRM.meta.isValid}
                className="relaxed"
                secondary
              >
                Save
              </Button>
              <Button disabled={!OFFERS_FRM.meta.isValid} primary type="button">Submit for Approval</Button>
            </Button.Group>
          </div>
          <Divider section />
          <Header as="h4">Manager</Header>
          <FormTextarea
            name="managerOverview"
            fielddata={MANAGERS_FRM.fields.managerOverview}
            changed={(e, result) => formChange(e, result, 'MANAGERS_FRM')}
            containerclassname="secondary"
          />
          <div className="right-align">
            <Button.Group>
              <Button disabled={!MANAGERS_FRM.meta.isValid} className="relaxed" secondary>Deny</Button>
              <Button disabled={!MANAGERS_FRM.meta.isValid} primary className="relaxed" type="button">Approve</Button>
            </Button.Group>
          </div>
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this offer?"
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => removeData(confirmModalName)}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
