import React, { Component } from 'react';
import Parser from 'html-react-parser';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Header, Table, Divider, Grid, Popup, Icon, Statistic } from 'semantic-ui-react';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_REGULATION, CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../../constants/offering';
import { InlineLoader } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';
import PaymentCalculator from './PaymentCalculator';
import KeytermsSecurityDetails from './KeytermsSecurityDetails';

const isMobile = document.documentElement.clientWidth < 768;

@inject('campaignStore')
@observer
class KeyTermsDetails extends Component {
  state = {
    offeringAmt: 0,
    RangeValue: 0,
  }
  componentWillMount() {
    this.props.campaignStore.calculateTotalPaymentData();
  }
  handleRangeChange = (e) => {
    const offeringAmt = (e.target.value / e.target.max) * 100;
    this.setState({ offeringAmt });
    this.setState({ RangeValue: e.target.value });
    this.props.campaignStore.calculateTotalPaymentData(e.target.value);
  }
  render() {
    const { KeyTerms, launch } = this.props;
    const {
      totalPayment, principalAmt, totalPaymentChart,
    } = this.props.campaignStore;
    const maturityMonth = KeyTerms && KeyTerms.maturity ? `${KeyTerms.maturity} Months` : '[XX] Months';
    const { offerStructure } = this.props.campaignStore;
    const edgarLink = launch && launch.edgarLink;
    const revenueShareSummary =
      KeyTerms && KeyTerms.revShareSummary && KeyTerms.securities ===
      CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE ? KeyTerms.revShareSummary : null;
    const keytermsMeta = [
      { key: 'minOfferingAmount', label: 'Offering Min', popupContent: 'If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account.' },
      { key: 'maxOfferingAmount', label: 'Offering Max', popupContent: 'The offering will remain open until the issuer raises the maximum goal or the offering period ends. As long as the raise exceeds the minimumgoal, the issuer will receive the funds.' },
      { key: 'minInvestAmt', label: 'Min Individual Investment', popupContent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor' },
    ];
    return (
      <Aux>
        <Grid columns={3} divided stackable className="vertical-gutter neutral-text">
          <Grid.Column>
            <p><b>Issuer</b><br />{get(KeyTerms, 'legalBusinessName') || 'NA' }</p>
          </Grid.Column>
          <Grid.Column>
            <p><b>Type of Offering</b><br />{get(KeyTerms, 'regulation') ? CAMPAIGN_KEYTERMS_REGULATION[KeyTerms.regulation] : 'NA'}</p>
          </Grid.Column>
          <Grid.Column>
            <p><b>Type of Securities</b><br />{get(KeyTerms, 'securities') ? CAMPAIGN_KEYTERMS_SECURITIES[KeyTerms.securities] : 'NA'}</p>
          </Grid.Column>
        </Grid>
        <Divider />
        <Table basic="very" className="key-terms-table">
          <Table.Body>
            {keytermsMeta.map(type => (
              <Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text"><b>{type.label}{' '}</b>
                  {type.popupContent &&
                    <Popup
                      trigger={<Icon name="help circle" color="green" />}
                      content={type.popupContent}
                      position="top center"
                    />
                  }
                </Table.Cell>
                <Table.Cell>
                  <p>
                    {get(KeyTerms, type.key) ?
                      Helper.CurrencyFormat(get(KeyTerms, type.key))
                      :
                      'NA'}
                  </p>
                </Table.Cell>
              </Table.Row>
            ))
            }
            <Table.Row verticalAlign="top">
              <Table.Cell width={5} className="neutral-text"><b>Maturity{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content={`If the investors have not been paid in full within ${maturityMonth}, the Issuer is required to promptly pay the entire outstanding balance to the investors.`}
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell>
                {KeyTerms && KeyTerms.maturity ? `${KeyTerms.maturity} Months` : 'NA'}
                {
                    KeyTerms && KeyTerms.startupPeriod &&
                    ` including a ${KeyTerms.startupPeriod} month startup period for ramp up`
                  }
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top" >
              <Table.Cell width={5} className="neutral-text"><b>Payments{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content="The Issuer will make monthly payments based on the relevant revenue sharing percentage."
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell>
                <p>
                  {KeyTerms && KeyTerms.frequencyOfPayments ? KeyTerms.frequencyOfPayments
                      : 'NA'}
                </p>
              </Table.Cell>
            </Table.Row>
            <KeytermsSecurityDetails {...this.props} />
            <Table.Row verticalAlign="top">
              <Table.Cell width={5} className="neutral-text">
                <b>Ownership % Represented by Securities</b>
              </Table.Cell>
              <Table.Cell>
                {KeyTerms && KeyTerms.securitiesOwnershipPercentage ?
                  <p>
                    <b>{KeyTerms.securitiesOwnershipPercentage}%</b>{' '}
                    Investors will not receive any equity interests in the Issuer or
                    any voting or management rights with respect to the Issuer as a result of
                    an investment in Securities.
                  </p>
                  :
                  'NA'
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell colSpan={2} className="center-align">
                <a href={edgarLink} target="blank" className="highlight-text">
                  View the Issuer&apos;s SEC Form C filing
                </a>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Divider section hidden />
        {offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE ?
          <Aux>
            <Header as="h3" className="mb-30 anchor-wrap">
              Total Payment Calculator
              <span className="anchor" id="total-payment-calculator" />
            </Header>
            <Grid columns={4} divided doubling stackable className="mb-30 mt-30 investment-grid">
              <Grid.Column>
                <Statistic className="basic" size="mini">
                  <Statistic.Label className={isMobile && 'center-align'}>Interest Rate*</Statistic.Label>
                  <Statistic.Value className={isMobile && 'center-align'}>{parseFloat(get(KeyTerms, 'interestRate')) || ' - '}%</Statistic.Value>
                </Statistic>
              </Grid.Column>
              <Grid.Column>
                <Statistic className="basic" size="mini">
                  <Statistic.Label className={isMobile && 'center-align'}>Term</Statistic.Label>
                  <Statistic.Value className={isMobile && 'center-align'}>{get(KeyTerms, 'maturity') || ' - '} months</Statistic.Value>
                </Statistic>
              </Grid.Column>
              <Grid.Column>
                <Statistic className="basic" size="mini">
                  <Statistic.Label className={isMobile && 'center-align'}>Principal</Statistic.Label>
                  <Statistic.Value className={`${isMobile && 'center-align'} highlight-text mb-10`}>
                    {Helper.CurrencyFormat(principalAmt)}
                  </Statistic.Value>
                  <div className="slider-container">
                    <p style={{ width: `${this.state.offeringAmt}%` }} />
                    <input
                      type="range"
                      min={0}
                      max={6}
                      value={this.state.RangeValue}
                      onChange={this.handleRangeChange}
                      className="slider mt-10 mb-10"
                      id="myRange"
                    />
                    <span className="one" />
                    <span className="two" />
                    <span className="three" />
                    <span className="four" />
                    <span className="five" />
                    <span className="six" />
                    <span className="seven" />
                  </div>
                </Statistic>
              </Grid.Column>
              <Grid.Column>
                <Statistic className="basic" size="mini">
                  <Statistic.Label className={isMobile && 'center-align'}>Total Payment*</Statistic.Label>
                  <Statistic.Value className={`highlight-text ${isMobile && 'center-align'}`}>{Helper.CurrencyFormat(totalPayment)}</Statistic.Value>
                </Statistic>
              </Grid.Column>
            </Grid>
            {totalPaymentChart.length === parseFloat(get(KeyTerms, 'maturity')) ?
              <PaymentCalculator data={totalPaymentChart} propsDetails={this.props} /> :
              <p><InlineLoader text="Insufficient Data To Display Payment Calculator" /></p>
            }
            <p className="mt-30 note">
              * Payment for any given month (including the total payment at the end of the
              final month) indicates the cumulative amount contractually required to be paid
              to an investor after the end of that month, assuming the loan is not prepaid.
              This calculation is a mathematical illustration only and may not reflect actual
              performance. It does not take into account NextSeed fees of 1% on each payment
              made to investors. Payment is not guaranteed or insured and investors may lose
              some or all of the principal invested if the Issuer cannot make its payments.
            </p>
          </Aux>
          : offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE ?
            <Aux>
              <Header as="h3" className="mb-30 anchor-wrap">
                Revenue Sharing Summary*
                <span className="anchor" id="revenue-sharing-summary" />
              </Header>
              <p>
                {revenueShareSummary ?
                  <p className="detail-section">
                    {Parser(revenueShareSummary)}
                  </p>
                  :
                  <InlineLoader text="No data available" className="bg-offwhite" />
                }
              </p>
            </Aux>
          :
            null
        }
        <p className="note">
          * For illustration only. See expanded Payment Calculator view to read more
          regarding actual performance variables.
        </p>
      </Aux>
    );
  }
}

export default KeyTermsDetails;
