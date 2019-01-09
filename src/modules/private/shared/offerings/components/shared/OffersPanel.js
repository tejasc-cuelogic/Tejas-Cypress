import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { observer } from 'mobx-react';
import { Table, Icon, Button, Card, Modal, Header } from 'semantic-ui-react';
import { NsCarousel } from '../../../../../../theme/shared';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import { FormInput, MaskedInput, FormDropDown } from '../../../../../../theme/form';
import { STRUCTURE_TYPES, PERSONAL_GUARANTEE_TYPES } from '../../../../../../services/constants/admin/businessApplication';
import Helper from '../../../../../../helper/utility';

const isSmallMonitor = document.documentElement.clientWidth < 1920;
const isTablet = document.documentElement.clientWidth < 992;
@observer
export default class OffersPanel extends Component {
  state = {
    showModal: false,
    modalIndex: 0,
  }
  formChangeWithIndex = (e, result, form, arrayName, index) => {
    this.props.formChangeWithIndex(e, result, form, arrayName, index);
  }
  maskChangeWithIndex = (values, form, arrayName, field, index) => {
    this.props.maskChangeWithIndex(values, form, arrayName, field, index);
  }
  addAssignedTerms = (index) => {
    this.setState({ showModal: false });
    this.props.assignAdditionalTermsValue(index);
  }
  closeModal = (index) => {
    this.setState({ showModal: false });
    this.props.addAdditionalTermsToFormData(index);
  }
  openModal = (index) => {
    if (!this.props.isReadonly) {
      this.setState({ showModal: true });
      this.setState({ modalIndex: index });
    }
  }
  render() {
    const {
      OFFERS_FRM, isReadonly, match, selectOffer, selectedOfferIndex, refModule,
      toggleConfirmModal,
    } = this.props;
    const settings = {
      dots: false,
      arrows: true,
      speed: 500,
      initialSlide: 0,
      className: 'offers-carousel',
      slidesToShow: isTablet ? '1' : isSmallMonitor || refModule === 'admin' ? '2' : 3,
      slidesToScroll: 1,
    };
    const offerFields = OFFERS_FRM.fields.offer[0];
    return (
      <Aux>
        <NsCarousel {...settings}>
          {OFFERS_FRM.fields.offer.map((offer, index) => (
            <Card fluid className={`offer-card ${selectedOfferIndex === index ? 'active' : ''}`}>
              <Card.Content>
                <Card.Header>
                  Offer {String.fromCharCode('A'.charCodeAt() + index)}
                  {!isReadonly && OFFERS_FRM.fields.offer.length > 1 &&
                  <Link to={match.url} onClick={e => toggleConfirmModal(e, index, 'offer')} className="pull-right">
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
                        <FormDropDown
                          fielddata={offer.structure}
                          ishidelabel
                          containerclassname={isReadonly ? 'display-only' : ''}
                          className={isReadonly ? 'display-only secondary' : 'secondary'}
                          readOnly={isReadonly}
                          name="structure"
                          placeholder="Choose"
                          fluid
                          selection
                          options={STRUCTURE_TYPES}
                          onChange={(e, result) => this.formChangeWithIndex(e, result, 'OFFERS_FRM', 'offer', index)}
                        />
                      </Table.Cell>
                    </Table.Row>
                    {!isReadonly ?
                      <Aux>
                        <Table.Row>
                          <Table.Cell>{offerFields.minimumAmount.label}</Table.Cell>
                          <Table.Cell>
                            <MaskedInput
                              containerclassname={isReadonly ? 'display-only' : ''}
                              readOnly={isReadonly}
                              prefix="$"
                              currency
                              name="minimumAmount"
                              fielddata={offer.minimumAmount}
                              changed={(values, field) => this.maskChangeWithIndex(values, 'OFFERS_FRM', 'offer', field, index)}
                              hidelabel
                            />
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>{offerFields.amount.label}</Table.Cell>
                          <Table.Cell>
                            <MaskedInput
                              containerclassname={isReadonly ? 'display-only' : ''}
                              readOnly={isReadonly}
                              prefix="$"
                              currency
                              name="amount"
                              fielddata={offer.amount}
                              changed={(values, field) => this.maskChangeWithIndex(values, 'OFFERS_FRM', 'offer', field, index)}
                              hidelabel
                            />
                          </Table.Cell>
                        </Table.Row>
                      </Aux> :
                      <Table.Row>
                        <Table.Cell>Maximum Offering Amount</Table.Cell>
                        <Table.Cell>{`${Helper.CurrencyFormat(offer.minimumAmount.value)} - ${Helper.CurrencyFormat(offer.amount.value)}`}</Table.Cell>
                      </Table.Row>
                      }
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
                    {offer.structure.value === 'TERM_NOTE' &&
                    <Aux>
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
                    </Aux>
                    }
                    {offer.structure.value === 'REVENUE_SHARING_NOTE' &&
                    <Aux>
                      <Table.Row>
                        <Table.Cell>{offerFields.mthRevenueSharing.label}</Table.Cell>
                        <Table.Cell>
                          <MaskedInput
                            containerclassname={isReadonly ? 'display-only' : ''}
                            readOnly={isReadonly}
                            name="mthRevenueSharing"
                            fielddata={offer.mthRevenueSharing}
                            changed={(values, field) => this.maskChangeWithIndex(values, 'OFFERS_FRM', 'offer', field, index)}
                            hidelabel
                            percentage
                          />
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>{offerFields.multiple.label}</Table.Cell>
                        <Table.Cell>
                          <FormInput
                            containerclassname={isReadonly ? 'display-only' : ''}
                            readOnly={isReadonly}
                            name="multiple"
                            fielddata={offer.multiple}
                            changed={(e, result) => this.formChangeWithIndex(e, result, 'OFFERS_FRM', 'offer', index)}
                            ishidelabel
                          />
                        </Table.Cell>
                      </Table.Row>
                    </Aux>
                    }
                    <Table.Row>
                      <Table.Cell>{offerFields.personalGuarantee.label}</Table.Cell>
                      <Table.Cell>
                        <FormDropDown
                          fielddata={offer.personalGuarantee}
                          ishidelabel
                          containerclassname={isReadonly ? 'display-only' : ''}
                          className={isReadonly ? 'display-only secondary' : 'secondary'}
                          readOnly={isReadonly}
                          name="personalGuarantee"
                          placeholder="Choose"
                          fluid
                          selection
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
                    {offer.structure.value === 'TERM_NOTE' &&
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
                          readOnly={isReadonly}
                          hidelabel
                        />
                      </Table.Cell>
                    </Table.Row>
                    }
                    {((!isReadonly) || (isReadonly && offer.additionalTerms.value)) &&
                      <Table.Row>
                        <Table.Cell>{offerFields.additionalTerms.label}</Table.Cell>
                        <Table.Cell>
                          {isReadonly && offer.additionalTerms.value &&
                            <Button size="small" color="blue" className="link-button" onClick={() => selectOffer('selectedOfferIndex', index, 1)} >{offer.additionalTermsField.value}</Button>
                          }
                          {!isReadonly &&
                          <FormInput
                            onClick={() => this.openModal(index)}
                            containerclassname={isReadonly ? 'display-only' : ''}
                            readOnly={isReadonly}
                            name="additionalTermsField"
                            fielddata={offer.additionalTermsField}
                            ishidelabel
                          />
                          }
                        </Table.Cell>
                      </Table.Row>
                    }
                  </Table.Body>
                </Table>
              </div>
              {this.props.refModule !== 'admin' && (
                <Card.Content extra className="center-align">
                  {selectedOfferIndex !== index ?
                    <Button primary className="relaxed" content="View Details" onClick={() => selectOffer('selectedOfferIndex', index)} />
                  : <Button as="span" className="time-stamp">See details below</Button>
                  }
                </Card.Content>
              )}
            </Card>
          ))}
        </NsCarousel>
        <Modal
          closeIcon
          open={this.state.showModal}
          onClose={() => this.closeModal(this.state.modalIndex)}
          closeOnEscape={false}
          closeOnDimmerClick={false}
          size="small"
        >
          <Modal.Content className="transaction-details">
            <Header as="h3">
                              Add Additional Terms
            </Header>
            <HtmlEditor
              name="additionalTerms"
              overrides={{ height: '244px' }}
              changed={(name, value) => this.formChangeWithIndex(null, { name, value }, 'OFFERS_FRM', 'offer', this.state.modalIndex)}
              content={OFFERS_FRM.fields.offer[this.state.modalIndex].additionalTerms.value || null}
            />
            <div className="right-align mt-30">
              <Button content="Save Terms" color="green" onClick={() => this.addAssignedTerms(this.state.modalIndex)} />
            </div>
          </Modal.Content >
        </Modal>
      </Aux>
    );
  }
}
