import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Header, Form, Table, Dropdown, Icon, Confirm } from 'semantic-ui-react';
import { FormInput, MaskedInput } from '../../../../../../../theme/form';
import { STRUCTURE_TYPES } from '../../../../../../../services/constants/admin/businessApplication';
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
      offersChange,
      confirmModal,
      confirmModalName,
      removeData,
    } = this.props.businessAppReviewStore;
    const offerFields = OFFERS_FRM.fields.data[0];
    return (
      <div className="inner-content-spacer">
        <Header as="h4">
          Offers
        </Header>
        {OFFERS_FRM.fields.data.length < 4 &&
        <Link color="blue" to={this.props.match.url} className="link" onClick={e => this.addNewOffer(e)}><small>+ Add new offer</small></Link>
        }
        <Form>
          <Table basic compact className="form-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                {
                  OFFERS_FRM.fields.data.map((offer, index) => (
                    <Table.HeaderCell>Offer {String.fromCharCode('A'.charCodeAt() + index)}
                      <Link to={this.props.match.url} className="icon-link" onClick={e => this.toggleConfirmModal(e, index)} >
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
                OFFERS_FRM.fields.data.map((offer, index) => (
                  <Table.Cell>
                    <Dropdown
                      name="structure"
                      options={STRUCTURE_TYPES}
                      fielddata={offer.structure}
                      changed={(e, result) => offersChange(e, result, index)}
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
                    <MaskedInput
                      prefix="$"
                      currency
                      name="offeringAmount"
                      fielddata={offer.offeringAmount}
                      changed={values => offersChange(values, index)}
                      hidelabel
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
                      changed={values => offersChange(values, index)}
                      hidelabel
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
                      changed={values => offersChange(values, index)}
                      hidelabel
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
                      name="amortizationAmount"
                      fielddata={offer.amortizationAmount}
                      changed={values => offersChange(values, index)}
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
                    <FormInput
                      name="personalGuarantee"
                      fielddata={offer.personalGuarantee}
                      changed={(e, result) => offersChange(e, result, index)}
                      ishidelabel
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
                      changed={(e, result) => offersChange(e, result, index)}
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
                      changed={values => offersChange(values, index)}
                      fielddata={offer.expirationDate}
                      hidelabel
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
                    <MaskedInput
                      name="multipleOnPrincipalToPay"
                      fielddata={offer.multipleOnPrincipalToPay}
                      changed={values => offersChange(values, index)}
                      hidelabel
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
                      name="totalCapitalReturned"
                      fielddata={offer.totalCapitalReturned}
                      changed={values => offersChange(values, index)}
                      hidelabel
                    />
                  </Table.Cell>
                ))
                }
              </Table.Row>
              <Table.Row>
                <Table.Cell>Portal agreement upload</Table.Cell>
                <Table.Cell colSpan="4">Link to add agreement</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
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
