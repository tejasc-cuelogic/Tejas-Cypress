import React, { Component } from 'react';
import { get, isNaN, toNumber } from 'lodash';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import money from 'money-math';
import { Header, Table, Divider, Grid, Popup, Icon, Statistic } from 'semantic-ui-react';
import {
  CAMPAIGN_KEYTERMS_SECURITIES,
  CAMPAIGN_OFFERED_BY,
  CAMPAIGN_REGULATION_DETAILED,
  CAMPAIGN_KEYTERMS_SECURITIES_ENUM,
} from '../../../../../../constants/offering';
import { InlineLoader } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';
import PaymentCalculator from './PaymentCalculator';
import HtmlEditor from '../../../../../shared/HtmlEditor';

const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth < 992;

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
    const { KeyTerms } = this.props;
    const {
      totalPayment, principalAmt, totalPaymentChart, campaign, offerStructure, campaignStatus,
    } = this.props.campaignStore;
    const investmentMultiple = get(campaign, 'closureSummary.keyTerms.multiple') || 'XXX';
    const totalInvestmentAmount = get(campaign, 'closureSummary.totalInvestmentAmount') || 0;
    const totalInvestmentAmountCf = get(campaign, 'closureSummary.totalInvestmentAmountCf') || 0;
    const totalInvestmentAmount506C = get(campaign, 'closureSummary.totalInvestmentAmount506C') || 0;
    const investmentMultipleTooltip = isNaN(toNumber(investmentMultiple) * 100) ? 0 : investmentMultiple;
    const portal = campaign && campaign.regulation ? (campaign.regulation.includes('BD') ? '2%' : '1%') : '';
    const maturityMonth = KeyTerms && KeyTerms.maturity ? `${KeyTerms.maturity} Months` : '[XX] Months';
    const edgarLink = get(campaign, 'offering.launch.edgarLink');
    const revenueShareSummary = KeyTerms && KeyTerms.revShareSummary && offerStructure
        === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE ? KeyTerms.revShareSummary : null;
    const keytermsMeta = [
      { key: 'minOfferingAmountCF', label: 'Offering Min', popupContent: 'If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account.' },
      { key: 'maxOfferingAmountCF', label: 'Offering Max', popupContent: 'The offering will remain open until the issuer raises the maximum goal or the offering period ends. As long as the raise exceeds the minimum goal, the issuer will receive the funds.' },
      { key: 'minInvestAmt', label: 'Min Individual Investment', popupContent: 'This is the minimum individual investment amount to participate in this offering.' },
    ];
    const minOfferingAmountD = get(KeyTerms, 'minOfferingAmount506') ? get(KeyTerms, 'minOfferingAmount506') : get(KeyTerms, 'minOfferingAmount506C');
    const maxOfferingAmountD = get(KeyTerms, 'maxOfferingAmount506') ? get(KeyTerms, 'maxOfferingAmount506') : get(KeyTerms, 'maxOfferingAmount506C');
    return (
      <Aux>
        <Grid columns={3} divided stackable className="vertical-gutter neutral-text">
          <Grid.Column>
            <p><b>Issuer</b><br />{get(KeyTerms, 'legalBusinessName') || 'NA'}</p>
          </Grid.Column>
          <Grid.Column>
            <p>
              <b>Type of Offering</b>
              {get(campaign, 'regulation')
                && CAMPAIGN_REGULATION_DETAILED.TOOLTIP[campaign.regulation]
                ? (
<Popup
  trigger={<Icon name="help circle" color="green" />}
  content={
                    CAMPAIGN_REGULATION_DETAILED.TOOLTIP[campaign.regulation]
                  }
  hoverable
  position="top center"
/>
                ) : ''
              }
              <br />
              {get(campaign, 'regulation') ? CAMPAIGN_REGULATION_DETAILED.REGULATION[campaign.regulation] : 'NA'}
            </p>
          </Grid.Column>
          <Grid.Column>
            <p><b>Offered By</b><br />
              {CAMPAIGN_OFFERED_BY[get(KeyTerms, 'regulation')]}
            </p>
          </Grid.Column>
        </Grid>
        {!isMobile ? <Divider /> : null}
        <Table basic="very" className="key-terms-table">
          <Table.Body>
            {keytermsMeta.map(type => (
              <Aux key={type.key}>
                {get(KeyTerms, type.key)
                  ? (
<Table.Row verticalAlign="top">
                    <Table.Cell width={5} className="neutral-text"><b>{type.label}{' '}</b>
                      {type.popupContent
                        && (
<Popup
  trigger={<Icon name="help circle" color="green" />}
  content={type.popupContent}
  position="top center"
/>
                        )
                      }
                    </Table.Cell>
                    <Table.Cell>
                      <p>
                        {get(KeyTerms, 'regulation') === 'BD_CF_506C' && get(KeyTerms, type.key) && ['minOfferingAmountCF', 'maxOfferingAmountCF'].includes(type.key)
                          ? type.key === 'minOfferingAmountCF'
                            ? Helper
                              .CurrencyFormat(money
                                .add(get(KeyTerms, type.key), minOfferingAmountD), 0)
                            : type.key === 'maxOfferingAmountCF'
                            && Helper
                              .CurrencyFormat(money
                                .add(get(KeyTerms, type.key), maxOfferingAmountD), 0)
                          : get(KeyTerms, type.key)
                            ? Helper.CurrencyFormat(get(KeyTerms, type.key), 0)
                            : 'NA'}
                      </p>
                    </Table.Cell>
                  </Table.Row>
                  ) : ''
                }
              </Aux>
            ))
            }
            {get(KeyTerms, 'regulation') === 'BD_CF_506C'
              && (
<Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text"><b>Raised to date{' '}</b>
                </Table.Cell>
                <Table.Cell>
                  <p>
                    {Helper.CurrencyFormat(totalInvestmentAmount, 0)}
                  </p>
                  <p>
                    <i>{`${Helper.CurrencyFormat(totalInvestmentAmountCf, 0)} (under Regulation Crowdfunding)`}</i>
                  </p>
                  <p>
                    <i>{`${Helper.CurrencyFormat(totalInvestmentAmount506C, 0)} (under Regulation D)`}</i>
                  </p>
                </Table.Cell>
              </Table.Row>
              )
            }
            {get(KeyTerms, 'securities')
              && (
<Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text"><b>Type of Securities{' '}</b></Table.Cell>
                <Table.Cell>
                  <p>
                    {offerStructure ? CAMPAIGN_KEYTERMS_SECURITIES[offerStructure] : 'NA'}
                  </p>
                </Table.Cell>
              </Table.Row>
              )
            }
            {get(KeyTerms, 'investmentMultiple')
              && (
<Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text"><b>Investment Multiple{' '}</b>
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content={`For every $100 you invest, you are paid a portion of this company's gross revenue every month until you are paid $${investmentMultipleTooltip * 100} within ${maturityMonth === '[XX] Months' ? 'YY' : maturityMonth}. ${portal ? `A ${portal} service fee is deducted from each payment.` : ''}`}
                    position="top center"
                  />
                </Table.Cell>
                <Table.Cell>
                  <p>
                    {get(KeyTerms, 'investmentMultiple') ? get(KeyTerms, 'investmentMultiple') : 'NA'}
                  </p>
                  <HtmlEditor
                    readOnly
                    content={get(KeyTerms, 'investmentMultipleSummary')
                      ? get(KeyTerms, 'investmentMultipleSummary')
                      : ''}
                  />
                </Table.Cell>
              </Table.Row>
              )
            }
            {get(KeyTerms, 'revSharePercentage')
              && (
<Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text"><b>Revenue Sharing Percentage</b></Table.Cell>
                <Table.Cell>
                  <p>
                    {get(KeyTerms, 'revSharePercentage') < 10 ? 'Up to ' : ''}
                    {`${get(KeyTerms, 'revSharePercentage')}${get(KeyTerms, 'revSharePercentage').includes('%') ? '' : '%'}` || ''}
                  </p>
                  <HtmlEditor
                    readOnly
                    content={get(KeyTerms, 'revSharePercentageDescription')
                      ? get(KeyTerms, 'revSharePercentageDescription')
                      : ''}
                  />
                </Table.Cell>
              </Table.Row>
              )
            }
            {get(KeyTerms, 'maturity')
              && (
<Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text"><b>Maturity{' '}</b>
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content={`If the investors have not been paid in full within ${maturityMonth}, the Issuer is required to promptly pay the entire outstanding balance to the investors.`}
                    position="top center"
                  />
                </Table.Cell>
                <Table.Cell>
                  {KeyTerms && KeyTerms.maturity ? `${KeyTerms.maturity} months` : 'N/A'}
                  {
                    KeyTerms && KeyTerms.startupPeriod
                    && `, including a ${KeyTerms.startupPeriod}-month startup period for ramp up`
                  }
                </Table.Cell>
              </Table.Row>
              )
            }
            {get(KeyTerms, 'frequencyOfPayments')
              && (
<Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text"><b>Payments{' '}</b>
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content={`The Issuer will make ${KeyTerms && KeyTerms.frequencyOfPayments ? KeyTerms.frequencyOfPayments
                      : ''} payments based on the relevant revenue sharing percentage.`}
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
              )
            }
            {get(KeyTerms, 'securityInterest')
              && (
<Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text"><b>Security Interest{' '}</b>
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content="The Issuer will grant a security interest in all of it's assets in favor of NextSeed for the benefit of the investors to secure the Issuer’s obligations under the Securities. For more details, please see the disclosure statement."
                    position="top center"
                  />
                </Table.Cell>
                <Table.Cell>
                  {KeyTerms && KeyTerms.securityInterest ? KeyTerms.securityInterest : ' NA'}
                </Table.Cell>
              </Table.Row>
              )
            }
            {get(KeyTerms, 'securitiesOwnershipPercentage')
              && (
<Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text">
                  <b>Ownership % Represented by Securities</b>
                </Table.Cell>
                <Table.Cell>
                  {KeyTerms && KeyTerms.securitiesOwnershipPercentage
                    ? (
<p>
                      {KeyTerms.securitiesOwnershipPercentage}% {' '}
                      Investors will not receive any equity interests in the Issuer or
                      any voting or management rights with respect to the Issuer as a result of
                      an investment in Securities.
                    </p>
                    )
                    : 'NA'
                  }
                </Table.Cell>
              </Table.Row>
              )
            }
            {get(KeyTerms, 'interestRate')
              && (
<Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text"><b>Interest Rate{' '}</b>
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content={`Interest payment is calculated at a gross annualized interest rate of ${get(KeyTerms, 'interestRate') || ' - '}% each month on the remaining balance of your investment from the prior month.`}
                    position="top center"
                  />
                </Table.Cell>
                <Table.Cell>
                  {KeyTerms && KeyTerms.interestRate ? `${KeyTerms.interestRate}%` : 'NA'}
                </Table.Cell>
              </Table.Row>
              )
            }
            {/* {get(KeyTerms, 'roundType') &&
              <Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text"><b>Round Type{' '}</b>
                </Table.Cell>
                <Table.Cell>
                  <p>
                    {ROUND_TYPES_ENUM[KeyTerms.roundType]}
                  </p>
                </Table.Cell>
              </Table.Row>
            } */}
            {get(KeyTerms, 'unitPrice')
              && (
<Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text"><b>Share Price{' '}</b>
                </Table.Cell>
                <Table.Cell>
                  <p>
                    {Helper.CurrencyFormat(KeyTerms.unitPrice)}
                  </p>
                </Table.Cell>
              </Table.Row>
              )
            }
            {get(KeyTerms, 'premoneyValuation')
              && (
<Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text"><b>Pre-Money valuation{' '}</b>
                </Table.Cell>
                <Table.Cell>
                  <p>
                    {Helper.CurrencyFormat(KeyTerms.premoneyValuation)}
                  </p>
                </Table.Cell>
              </Table.Row>
              )
            }
            {get(KeyTerms, 'additionalKeyterms') && get(KeyTerms, 'additionalKeyterms').length !== 0
              && KeyTerms.additionalKeyterms.map(item => (
                <Table.Row verticalAlign="top">
                  <Table.Cell width={5} className="neutral-text"><b>{item.label}{' '}</b>
                  </Table.Cell>
                  <Table.Cell>
                    <HtmlEditor
                      readOnly
                      content={item.description || ''}
                    />
                  </Table.Cell>
                </Table.Row>
              ))
            }
            {edgarLink
              && (
<Table.Row verticalAlign="top">
                <Table.Cell colSpan={2} className="center-align">
                  <a href={edgarLink.includes('http') ? edgarLink : `http://${edgarLink}`} target="blank" className="highlight-text">
                    View the Issuer&apos;s SEC Form C filing
                  </a>
                </Table.Cell>
              </Table.Row>
              )}
          </Table.Body>
        </Table>
        <Divider section={!isMobile} hidden />
        {offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE
          ? (
<Aux>
            <Header as="h3" className={`${isTablet && 'mt-40'} mb-30 anchor-wrap`}>
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
                  <div className={`${isMobile && 'mb-20'} slider-container`}>
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
            {totalPaymentChart.length === parseFloat(get(KeyTerms, 'maturity'))
              ? <PaymentCalculator data={totalPaymentChart} propsDetails={this.props} />
              : <p><InlineLoader text="Insufficient Data To Display Payment Calculator" /></p>
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
          )
          : offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE && campaignStatus.revenueSharingSummary
            ? (
<Aux>
                <Header as="h3" className="mb-30 anchor-wrap">
                Revenue Sharing Summary
                <span className="anchor" id="revenue-sharing-summary" />
              </Header>
              {revenueShareSummary
                ? (
<p className="detail-section">
                  <HtmlEditor readOnly content={revenueShareSummary} />
                </p>
                )
                : <InlineLoader text="No data available" className="bg-offwhite" />
              }
            </Aux>
            )
            : null
        }
      </Aux>
    );
  }
}

export default KeyTermsDetails;
