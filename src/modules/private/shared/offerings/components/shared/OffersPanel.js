import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Dropdown, Icon, Button, Grid, Card } from 'semantic-ui-react';
import { FormInput, MaskedInput } from '../../../../../../theme/form';
import { STRUCTURE_TYPES, PERSONAL_GUARANTEE_TYPES } from '../../../../../../services/constants/admin/businessApplication';

export default class OffersPanel extends Component {
  formChangeWithIndex = (e, result, form, arrayName, index) => {
    this.props.formChangeWithIndex(e, result, form, arrayName, index);
  }
  maskChangeWithIndex = (values, form, arrayName, field, index) => {
    this.props.maskChangeWithIndex(values, form, arrayName, field, index);
  }
  render() {
    const {
      OFFERS_FRM, isReadonly, match, selectOffer, selectedOfferIndex,
      toggleConfirmModal,
    } = this.props;
    const offerFields = OFFERS_FRM.fields.offer[0];
    return (
      <Grid columns={2}>
        {OFFERS_FRM.fields.offer.map((offer, index) => (
          <Grid.Column>
            <Card fluid className="offer-card">
              <Card.Content>
                <Card.Header>
                  Offer {String.fromCharCode('A'.charCodeAt() + index)}
                  {!isReadonly && OFFERS_FRM.fields.offer.length > 1 &&
                  <Link to={match.url} onClick={e => toggleConfirmModal(e, index)} className="pull-right">
                    <Icon className="ns-close-circle" color="grey" />
                  </Link>
                  }
                </Card.Header>
              </Card.Content>
              <div className="table-wrapper">
                <Table basic compact singleLine>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>{offerFields.structure.label}</Table.Cell>
                      <Table.Cell>
                        <Dropdown
                          className={isReadonly ? 'display-only' : 'secondary'}
                          disabled={isReadonly}
                          name="structure"
                          placeholder="Choose"
                          fluid
                          selection
                          value={offer.structure.value}
                          options={STRUCTURE_TYPES}
                          onChange={(e, result) => this.formChangeWithIndex(e, result, 'OFFERS_FRM', 'offer', index)}
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>{offerFields.amount.label}</Table.Cell>
                      <Table.Cell>
                        <FormInput
                          containerclassname={isReadonly ? 'display-only' : ''}
                          readOnly={isReadonly}
                          name="amount"
                          fielddata={offer.amount}
                          changed={(e, result) => this.formChangeWithIndex(e, result, 'OFFERS_FRM', 'offer', index)}
                          ishidelabel
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>{offerFields.maturity.label}</Table.Cell>
                      <Table.Cell>
                        <MaskedInput
                          containerclassname={isReadonly ? 'display-only' : ''}
                          readOnly={isReadonly}
                          name="maturity"
                          fielddata={offer.maturity}
                          changed={(values, field) => this.maskChangeWithIndex(values, 'OFFERS_FRM', 'offer', field, index)}
                          hidelabel
                          number
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>{offerFields.interestRate.label}</Table.Cell>
                      <Table.Cell>
                        <MaskedInput
                          containerclassname={isReadonly ? 'display-only' : ''}
                          readOnly={isReadonly}
                          name="interestRate"
                          fielddata={offer.interestRate}
                          changed={(values, field) => this.maskChangeWithIndex(values, 'OFFERS_FRM', 'offer', field, index)}
                          hidelabel
                          percentage
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>{offerFields.amortizationAmount.label}</Table.Cell>
                      <Table.Cell>
                        <MaskedInput
                          containerclassname={isReadonly ? 'display-only' : ''}
                          readOnly={isReadonly}
                          prefix="$"
                          currency
                          name="amortizationAmount"
                          fielddata={offer.amortizationAmount}
                          changed={(values, field) => this.maskChangeWithIndex(values, 'OFFERS_FRM', 'offer', field, index)}
                          hidelabel
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>{offerFields.personalGuarantee.label}</Table.Cell>
                      <Table.Cell>
                        <Dropdown
                          className={isReadonly ? 'display-only' : 'secondary'}
                          disabled={isReadonly}
                          name="personalGuarantee"
                          placeholder="Type number"
                          fluid
                          selection
                          value={offer.personalGuarantee.value}
                          options={PERSONAL_GUARANTEE_TYPES}
                          onChange={(e, result) => this.formChangeWithIndex(e, result, 'OFFERS_FRM', 'offer', index)}
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>{offerFields.businessBlanket.label}</Table.Cell>
                      <Table.Cell>
                        <FormInput
                          containerclassname={isReadonly ? 'display-only' : ''}
                          readOnly={isReadonly}
                          name="businessBlanket"
                          fielddata={offer.businessBlanket}
                          changed={(e, result) => this.formChangeWithIndex(e, result, 'OFFERS_FRM', 'offer', index)}
                          ishidelabel
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>{offerFields.expirationDate.label}</Table.Cell>
                      <Table.Cell>
                        <MaskedInput
                          containerclassname={isReadonly ? 'display-only' : ''}
                          readOnly={isReadonly}
                          name="expirationDate"
                          changed={(values, field) => this.maskChangeWithIndex(values, 'OFFERS_FRM', 'offer', field, index)}
                          fielddata={offer.expirationDate}
                          format="##-##-####"
                          hidelabel
                          dateOfBirth
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>{offerFields.multiple.label}</Table.Cell>
                      <Table.Cell>
                        <FormInput
                          containerclassname={isReadonly ? 'display-only' : ''}
                          readOnly={isReadonly || offer.structure.value === 'TERM_NOTE'}
                          name="multiple"
                          fielddata={offer.multiple}
                          changed={(e, result) => this.formChangeWithIndex(e, result, 'OFFERS_FRM', 'offer', index)}
                          ishidelabel
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>{offerFields.totalCapital.label}</Table.Cell>
                      <Table.Cell>
                        <MaskedInput
                          prefix="$"
                          currency
                          name="totalCapital"
                          fielddata={offer.totalCapital}
                          changed={(values, field) => this.maskChangeWithIndex(values, 'OFFERS_FRM', 'offer', field, index)}
                          containerclassname={isReadonly ? 'display-only' : ''}
                          readOnly={isReadonly || offer.structure.value === 'TERM_NOTE'}
                          hidelabel
                        />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>
              {this.props.refModule !== 'admin' && (
                <Card.Content extra className="center-align">
                  {selectedOfferIndex !== index ?
                    <Button primary content="View Details" onClick={() => selectOffer('selectedOfferIndex', index)} />
                  : <p>See details below</p>
                  }
                </Card.Content>
              )}
            </Card>
          </Grid.Column>
        ))}
      </Grid>
    );
  }
}
