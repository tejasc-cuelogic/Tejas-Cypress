import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Header, Form, Table, Dropdown } from 'semantic-ui-react';
import { FormInput, MaskedInput, FormDatePicker } from '../../../../../../../theme/form';
import { STRUCTURE_TYPES } from '../../../../../../../services/constants/admin/businessApplication';
@inject('businessAppReviewStore')
@observer
export default class Offer extends Component {
  addNewOffer = (e) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore('OFFERS_FRM');
  }
  render() {
    const { OFFERS_FRM, offersChange } = this.props.businessAppReviewStore;
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
                <Table.HeaderCell>&nbsp;</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            {
              OFFERS_FRM.fields.data.map(offer => (
                Object.keys(offer).forEach(key => (
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        {offer[key].label}
                        jghjgjhghj
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))
              ))
            }
          </Table>
          {
          OFFERS_FRM.fields.data.length ?
          OFFERS_FRM.fields.data.map((offer, index) => (
            <Table basic compact className="form-table">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Offer {String.fromCharCode('A'.charCodeAt() + index)}</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Dropdown
                      name="structure"
                      options={STRUCTURE_TYPES}
                      fielddata={offer.structure}
                      changed={(e, result) => offersChange(e, result, index)}
                    />
                    <MaskedInput
                      prefix="$"
                      currency
                      name="offeringAmount"
                      fielddata={offer.offeringAmount}
                      changed={values => offersChange(values, index)}
                      hidelabel
                    />
                    {
                      ['maturity', 'interestRate', 'amortizationAmount'].map(field => (
                        <MaskedInput
                          key={field}
                          name={field}
                          fielddata={offer[field]}
                          changed={values => offersChange(values, index)}
                          hidelabel
                        />
                      ))
                    }
                    {
                      ['personalGuarantee', 'businessBlanket'].map(field => (
                        <FormInput
                          key={field}
                          name={field}
                          fielddata={offer[field]}
                          changed={(e, result) => offersChange(e, result, index)}
                          ishidelabel
                        />
                      ))
                    }
                    <FormDatePicker
                      name="expirationDate"
                      placeholder="Enter here"
                      selected={offer.expirationDate.value ?
                        moment(offer.expirationDate.value) : null}
                      changed={date => offersChange(date)}
                      fielddata={offer.expirationDate}
                    />
                    {
                      ['multipleOnPrincipalToPay', 'totalCapitalReturned'].map(field => (
                        <MaskedInput
                          key={field}
                          name={field}
                          fielddata={offer[field]}
                          changed={values => offersChange(values, index)}
                          hidelabel
                        />
                      ))
                    }
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          )) : ''
          }
        </Form>
      </div>
    );
  }
}
