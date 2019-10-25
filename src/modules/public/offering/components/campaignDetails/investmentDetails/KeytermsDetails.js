import React, { Component } from 'react';
import { get, isNaN, toNumber, capitalize } from 'lodash';
import { inject, observer } from 'mobx-react';
// import money from 'money-math';
import { Table, Divider, Grid, Popup, Icon } from 'semantic-ui-react';
import {
  CAMPAIGN_KEYTERMS_SECURITIES,
  CAMPAIGN_OFFERED_BY,
  CAMPAIGN_REGULATION_DETAILED,
  CAMPAIGN_KEYTERMS_REGULATION_PARALLEL,
  CAMPAIGN_KEYTERMS_SECURITIES_ENUM,
} from '../../../../../../constants/offering';
import Helper from '../../../../../../helper/utility';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import TotalPaymentCalculator from './totalPaymentCalculator';
import RevenueSharingSummaryBlock from './revenueSharingSummary';
import { PopUpModal } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

const KeyTermsFieldHoc = ({ data, title, field, content, titleAddon, noBgOffWhite }) => (
  get(data, field)
    ? (
      <Table.Row className={!noBgOffWhite ? 'bg-offwhite' : ''} verticalAlign="top">
        <Table.Cell width={7} className="neutral-text"><b>{title}{' '}</b>{titleAddon}</Table.Cell>
        <Table.Cell>{content || get(data, field)}</Table.Cell>
      </Table.Row>
    ) : ''
);

@inject('campaignStore')
@observer
class KeyTermsDetails extends Component {
  render() {
    const { newLayout } = this.props;
    const {
      campaign, offerStructure, campaignStatus,
    } = this.props.campaignStore;
    const { keyTerms } = campaign;
    const investmentMultiple = get(campaign, 'closureSummary.keyTerms.multiple') || 'XXX';
    const totalInvestmentAmount = get(campaign, 'closureSummary.totalInvestmentAmount') || 0;
    const totalInvestmentAmountCf = get(campaign, 'closureSummary.totalInvestmentAmountCf') || 0;
    const totalInvestmentAmount506C = get(campaign, 'closureSummary.totalInvestmentAmount506C') || 0;
    const investmentMultipleTooltip = isNaN(toNumber(investmentMultiple) * 100) ? 0 : investmentMultiple;
    const portal = campaign && campaign.regulation ? (campaign.regulation.includes('BD') ? '2%' : '1%') : '';
    const maturityMonth = keyTerms && keyTerms.maturity ? `${keyTerms.maturity} Months` : '[XX] Months';
    const edgarLink = get(campaign, 'offering.launch.edgarLink');
    const keytermsMeta = [
      { key: 'minOfferingAmountCF', label: 'Offering Min', popupContent: 'If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account.' },
      { key: 'maxOfferingAmountCF', label: 'Offering Max', popupContent: 'The offering will remain open until the issuer raises the maximum goal or the offering period ends. As long as the raise exceeds the minimum goal, the issuer will receive the funds.' },
      { key: 'minInvestAmt', label: 'Min Individual Investment', popupContent: 'This is the minimum individual investment amount to participate in this offering.' },
    ];

    // const minOfferingAmountD = get(keyTerms, 'minOfferingAmount506') ? get(keyTerms, 'minOfferingAmount506') : get(keyTerms, 'minOfferingAmount506C');
    // const maxOfferingAmountD = get(keyTerms, 'maxOfferingAmount506') ? get(keyTerms, 'maxOfferingAmount506') : get(keyTerms, 'maxOfferingAmount506C');
    return (
      <>
        <Grid columns={3} divided stackable className="vertical-gutter neutral-text">
          <Grid.Column>
            <p><b className={newLayout ? 'neutral-text' : ''}>Issuer</b><br />{get(keyTerms, 'legalBusinessName') || 'NA'}</p>
          </Grid.Column>
          <Grid.Column>
            <p>
              <b className={newLayout ? 'neutral-text' : ''}>Type of Offering</b>
              {get(campaign, 'regulation')
                && CAMPAIGN_REGULATION_DETAILED.TOOLTIP[campaign.regulation]
                ? isMobile
                  ? (<PopUpModal label="Type of Offering" content={CAMPAIGN_REGULATION_DETAILED.TOOLTIP[campaign.regulation]} />)
                  : (
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
              {get(campaign, 'regulation') ? get(campaign, 'regulation') === 'BD_CF_506C' ? CAMPAIGN_KEYTERMS_REGULATION_PARALLEL[campaign.regulation] : CAMPAIGN_REGULATION_DETAILED.REGULATION[campaign.regulation] : 'NA'}
            </p>
          </Grid.Column>
          <Grid.Column>
            <p><b className={newLayout ? 'neutral-text' : ''}>Offered By</b><br />
              {CAMPAIGN_OFFERED_BY[get(keyTerms, 'regulation')]}
            </p>
          </Grid.Column>
        </Grid>
        {!isMobile ? <Divider hidden={newLayout} /> : null}
        <Table basic="very" className="key-terms-table">
          <Table.Body>
            {keytermsMeta.map(type => (
              <React.Fragment key={type.key}>
                <KeyTermsFieldHoc
                  title={type.label}
                  data={keyTerms}
                  field={type.key}
                  noBgOffWhite
                  content={(
                    <p>
                      {get(keyTerms, 'regulation') === 'BD_CF_506C' && get(keyTerms, type.key) && ['minOfferingAmountCF', 'maxOfferingAmountCF'].includes(type.key)
                        ? type.key === 'minOfferingAmountCF'
                          ? Helper.CurrencyFormat(campaignStatus.minOffering, 0)
                          : type.key === 'maxOfferingAmountCF'
                          && Helper.CurrencyFormat(campaignStatus.maxOffering, 0)
                        : ['BD_506C', 'BD_506B'].includes(get(keyTerms, 'regulation')) && get(keyTerms, type.key) && ['minOfferingAmountCF', 'maxOfferingAmountCF'].includes(type.key)
                          ? type.key === 'minOfferingAmountCF'
                            ? Helper.CurrencyFormat(campaignStatus.minOffering, 0)
                            : type.key === 'maxOfferingAmountCF'
                            && Helper.CurrencyFormat(campaignStatus.maxOffering, 0)
                          : get(keyTerms, type.key)
                            ? Helper.CurrencyFormat(get(keyTerms, type.key), 0)
                            : 'NA'}
                    </p>
                  )}
                  titleAddon={type.popupContent
                    && isMobile
                    ? (<PopUpModal label={type.label} content={type.popupContent} />)
                    : (
                      <Popup
                        trigger={<Icon name="help circle" color="green" />}
                        content={type.popupContent}
                        position="top center"
                      />
                    )
                  }
                />
              </React.Fragment>
            ))
            }
            <KeyTermsFieldHoc
              data={campaign}
              field="closureSummary.totalInvestmentAmount"
              title="Raised to date"
              noBgOffWhite
              content={(
                <>
                  <p>
                    {Helper.CurrencyFormat(totalInvestmentAmount, 0)}
                  </p>
                  {get(keyTerms, 'regulation') === 'BD_CF_506C'
                  && (
                  <>
                    <p>
                      <i>{`${Helper.CurrencyFormat(totalInvestmentAmountCf, 0)} (under Regulation Crowdfunding)`}</i>
                    </p>
                    <p>
                      <i>{`${Helper.CurrencyFormat(totalInvestmentAmount506C, 0)} (under Regulation D)`}</i>
                    </p>
                  </>
                  )
                  }
                </>
              )}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="securities"
              title="Type of Securities"
              content={(
                <p>
                  {offerStructure ? CAMPAIGN_KEYTERMS_SECURITIES[offerStructure] : 'NA'}
                </p>
              )}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="investmentMultiple"
              title="Investment Multiple"
              titleAddon={
                isMobile
                  ? (<PopUpModal label="Investment Multiple" content={`For every $100 you invest, you are paid a portion of this company's gross revenue every month until you are paid $${investmentMultipleTooltip * 100} within ${maturityMonth === '[XX] Months' ? 'YY' : maturityMonth}. ${portal ? `A ${portal} service fee is deducted from each payment.` : ''}`} />)
                  : (
                    <Popup
                      trigger={<Icon name="help circle" color="green" />}
                      content={`For every $100 you invest, you are paid a portion of this company's gross revenue every month until you are paid $${investmentMultipleTooltip * 100} within ${maturityMonth === '[XX] Months' ? 'YY' : maturityMonth}. ${portal ? `A ${portal} service fee is deducted from each payment.` : ''}`}
                      position="top center"
                    />
                  )
              }
              content={(
                <>
                  <p>
                    {get(keyTerms, 'investmentMultiple') ? get(keyTerms, 'investmentMultiple') : 'NA'}
                  </p>
                  <HtmlEditor
                    readOnly
                    content={get(keyTerms, 'investmentMultipleSummary')
                      ? get(keyTerms, 'investmentMultipleSummary')
                      : ''}
                  />
                </>
              )}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="revSharePercentage"
              title="Revenue Sharing Percentage"
              content={(
                <>
                  <p>
                    {get(keyTerms, 'revSharePercentage') < 10 ? 'Up to ' : ''}
                    {`${get(keyTerms, 'revSharePercentage')}${get(keyTerms, 'revSharePercentage') && get(keyTerms, 'revSharePercentage').includes('%') ? '' : '%'}` || ''}
                  </p>
                  <HtmlEditor
                    readOnly
                    content={get(keyTerms, 'revSharePercentageDescription')
                      ? get(keyTerms, 'revSharePercentageDescription')
                      : ''}
                  />
                </>
              )}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="valuationCap"
              title="Valuation Cap"
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="discount"
              title="Discount"
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="interestRate"
              title="Annualized Interest Rate"
              titleAddon={isMobile
                ? (<PopUpModal label="Interest Rate" content={`Interest payment is calculated at a gross annualized interest rate of ${get(keyTerms, 'interestRate') || ' - '}% each month on the remaining balance of your investment from the prior month.`} />)
                : (
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content={`Interest payment is calculated at a gross annualized interest rate of ${get(keyTerms, 'interestRate') || ' - '}% each month on the remaining balance of your investment from the prior month.`}
                    position="top center"
                  />
                )
              }
              content={keyTerms && keyTerms.interestRate ? `${keyTerms.interestRate}%` : 'NA'}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="maturity"
              title="Maturity"
              content={(
                <>
                  {keyTerms && keyTerms.maturity ? `${keyTerms.maturity} months` : 'N/A'}
                  {
                    keyTerms && keyTerms.startupPeriod
                    && `, including a ${keyTerms.startupPeriod}-month startup period for ramp up`
                  }
                </>
              )}
              titleAddon={isMobile
                ? (<PopUpModal label="Maturity" content={`If the investors have not been paid in full within ${maturityMonth}, the Issuer is required to promptly pay the entire outstanding balance to the investors.`} />)
                : (
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content={`If the investors have not been paid in full within ${maturityMonth}, the Issuer is required to promptly pay the entire outstanding balance to the investors.`}
                    position="top center"
                  />
                )
              }
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="equityClass"
              title="Equity Class"
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="totalRoundSize"
              title="Total Round Size"
              content={(
                <p>
                  {Helper.CurrencyFormat(keyTerms.totalRoundSize, 0)}
                </p>
              )}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="premoneyValuation"
              title="Pre-Money valuation"
              content={(
                <p>
                  {Helper.CurrencyFormat(keyTerms.premoneyValuation, 0)}
                </p>
              )}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="unitPrice"
              title={`${capitalize(keyTerms.equityUnitType)} Price`}
              content={(
                <p>
                  {Helper.CurrencyFormat(keyTerms.unitPrice, 0)}
                </p>
              )}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="frequencyOfPayments"
              title="Payments"
              content={(
                <p>
                  {keyTerms && keyTerms.frequencyOfPayments ? keyTerms.frequencyOfPayments
                    : 'NA'}
                </p>
              )}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="securityInterest"
              title="Security Interest"
              content={keyTerms && keyTerms.securityInterest ? keyTerms.securityInterest : ' NA'}
              titleAddon={isMobile
                ? (<PopUpModal label="Security Interest" content="The Issuer will grant a security interest in all of it's assets in favor of NextSeed for the benefit of the investors to secure the Issuer’s obligations under the Securities. For more details, please see the disclosure statement." />)
                : (
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content="The Issuer will grant a security interest in all of it's assets in favor of NextSeed for the benefit of the investors to secure the Issuer’s obligations under the Securities. For more details, please see the disclosure statement."
                    position="top center"
                  />
                )
              }
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              title="Ownership % Represented by Securities"
              content={keyTerms && keyTerms.securitiesOwnershipPercentage
                ? (
                  <p>
                    {keyTerms.securitiesOwnershipPercentage}% {' '}
                    Investors will not receive any equity interests in the Issuer or
                    any voting or management rights with respect to the Issuer as a result of
                    an investment in Securities.
              </p>
                )
                : 'NA'
              }
              field="securitiesOwnershipPercentage"
            />
            {get(keyTerms, 'additionalKeyterms') && get(keyTerms, 'additionalKeyterms').length !== 0
              && keyTerms.additionalKeyterms.map(item => (
                <Table.Row className="bg-offwhite" verticalAlign="top">
                  <Table.Cell width={7} className="neutral-text"><b>{item.label}{' '}</b>
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
                    <a href={edgarLink && edgarLink.includes('http') ? edgarLink : `http://${edgarLink}`} target="blank" className="highlight-text">
                      View the Issuer&apos;s SEC Form C filing
                  </a>
                  </Table.Cell>
                </Table.Row>
              )}
          </Table.Body>
        </Table>
        <Divider section hidden />
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
