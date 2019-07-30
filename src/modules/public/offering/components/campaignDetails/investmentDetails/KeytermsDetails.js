import React, { Component } from 'react';
import { get, isNaN, toNumber } from 'lodash';
import { inject, observer } from 'mobx-react';
// import money from 'money-math';
import { Table, Divider, Grid, Popup, Icon } from 'semantic-ui-react';
import {
  CAMPAIGN_KEYTERMS_SECURITIES,
  CAMPAIGN_OFFERED_BY,
  CAMPAIGN_REGULATION_DETAILED,
  CAMPAIGN_KEYTERMS_SECURITIES_ENUM,
} from '../../../../../../constants/offering';
import Helper from '../../../../../../helper/utility';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import TotalPaymentCalculator from './totalPaymentCalculator';
import RevenueSharingSummaryBlock from './revenueSharingSummary';

const isMobile = document.documentElement.clientWidth < 768;

@inject('campaignStore')
@observer
class KeyTermsDetails extends Component {
  render() {
    const { KeyTerms, newLayout } = this.props;
    const {
      campaign, offerStructure, campaignStatus,
    } = this.props.campaignStore;
    const investmentMultiple = get(campaign, 'closureSummary.keyTerms.multiple') || 'XXX';
    const totalInvestmentAmount = get(campaign, 'closureSummary.totalInvestmentAmount') || 0;
    const totalInvestmentAmountCf = get(campaign, 'closureSummary.totalInvestmentAmountCf') || 0;
    const totalInvestmentAmount506C = get(campaign, 'closureSummary.totalInvestmentAmount506C') || 0;
    const investmentMultipleTooltip = isNaN(toNumber(investmentMultiple) * 100) ? 0 : investmentMultiple;
    const portal = campaign && campaign.regulation ? (campaign.regulation.includes('BD') ? '2%' : '1%') : '';
    const maturityMonth = KeyTerms && KeyTerms.maturity ? `${KeyTerms.maturity} Months` : '[XX] Months';
    const edgarLink = get(campaign, 'offering.launch.edgarLink');
    const keytermsMeta = [
      { key: 'minOfferingAmountCF', label: 'Offering Min', popupContent: 'If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account.' },
      { key: 'maxOfferingAmountCF', label: 'Offering Max', popupContent: 'The offering will remain open until the issuer raises the maximum goal or the offering period ends. As long as the raise exceeds the minimum goal, the issuer will receive the funds.' },
      { key: 'minInvestAmt', label: 'Min Individual Investment', popupContent: 'This is the minimum individual investment amount to participate in this offering.' },
    ];
    // const minOfferingAmountD = get(KeyTerms, 'minOfferingAmount506') ? get(KeyTerms, 'minOfferingAmount506') : get(KeyTerms, 'minOfferingAmount506C');
    // const maxOfferingAmountD = get(KeyTerms, 'maxOfferingAmount506') ? get(KeyTerms, 'maxOfferingAmount506') : get(KeyTerms, 'maxOfferingAmount506C');
    return (
      <>
        <Grid columns={3} divided stackable className="vertical-gutter neutral-text">
          <Grid.Column>
            <p><b className={newLayout ? 'neutral-text' : ''}>Issuer</b><br />{get(KeyTerms, 'legalBusinessName') || 'NA'}</p>
          </Grid.Column>
          <Grid.Column>
            <p>
              <b className={newLayout ? 'neutral-text' : ''}>Type of Offering</b>
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
            <p><b className={newLayout ? 'neutral-text' : ''}>Offered By</b><br />
              {CAMPAIGN_OFFERED_BY[get(KeyTerms, 'regulation')]}
            </p>
          </Grid.Column>
        </Grid>
        {!isMobile ? <Divider hidden={newLayout} /> : null}
        <Table basic="very" className="key-terms-table">
          <Table.Body>
            {keytermsMeta.map(type => (
              <React.Fragment key={type.key}>
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
                              ? Helper.CurrencyFormat(campaignStatus.minOffering, 0)
                              : type.key === 'maxOfferingAmountCF'
                              && Helper.CurrencyFormat(campaignStatus.maxOffering, 0)
                            : ['BD_506C', 'BD_506B'].includes(get(KeyTerms, 'regulation')) && get(KeyTerms, type.key) && ['minOfferingAmountCF', 'maxOfferingAmountCF'].includes(type.key)
                              ? type.key === 'minOfferingAmountCF'
                                ? Helper.CurrencyFormat(campaignStatus.minOffering, 0)
                                : type.key === 'maxOfferingAmountCF'
                                && Helper.CurrencyFormat(campaignStatus.maxOffering, 0)
                              : get(KeyTerms, type.key)
                                ? Helper.CurrencyFormat(get(KeyTerms, type.key), 0)
                                : 'NA'}
                        </p>
                    </Table.Cell>
                  </Table.Row>
                  ) : ''
                }
              </React.Fragment>
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
        {!newLayout && offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE
          ? (
            <TotalPaymentCalculator {...this.props} />
          )
          : !newLayout && offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE && campaignStatus.revenueSharingSummary
            ? (
              <RevenueSharingSummaryBlock {...this.props} />
            )
            : null
        }
      </>
    );
  }
}

export default KeyTermsDetails;
