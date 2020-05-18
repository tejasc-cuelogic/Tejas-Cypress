import React, { Component } from 'react';
import { get, capitalize } from 'lodash';
import { inject, observer } from 'mobx-react';
// import money from 'money-math';
import { Table, Divider, Grid } from 'semantic-ui-react';
import {
  CAMPAIGN_OFFERED_BY,
  CAMPAIGN_REGULATION_DETAILED,
  CAMPAIGN_KEYTERMS_REGULATION_PARALLEL,
  CAMPAIGN_SECURITIES_DETAILED,
  CAMPAIGN_KEYTERMS_EQUITY_CLASS,
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
    const totalInvestmentAmount = get(campaign, 'closureSummary.totalInvestmentAmount') || 0;
    const totalInvestmentAmountCf = get(campaign, 'closureSummary.totalInvestmentAmountCf') || 0;
    const totalInvestmentAmount506C = get(campaign, 'closureSummary.totalInvestmentAmount506C') || 0;
    const edgarLink = get(campaign, 'offering.launch.edgarLink');
    const keytermsMeta = [
      { key: 'minOfferingAmountCF', label: 'Offering Min', popupContent: 'This is the minimum fundraising goal. If this amount is not raised by the end of the offering period, any funds invested will be automatically returned to your NextSeed account.' },
      { key: 'maxOfferingAmountCF', label: 'Offering Max', popupContent: 'This is the maximum fundraising goal. The offering will remain open until the issuer raises the Offering Max or the offering period ends. As long as the raise exceeds the Offering Min, the issuer will receive the funds.' },
      { key: 'minInvestAmt', label: 'Min Individual Investment', popupContent: 'This is the minimum individual investment amount required to participate in this offering. This amount is set by the Issuer.' },
    ];
    return (
      <>
        <Grid columns={3} divided stackable className="key-terms vertical-gutter neutral-text">
          <Grid.Column>
            <p><b className={newLayout ? 'neutral-text' : ''}>{campaignStatus.isFund ? 'Fund' : 'Issuer'}</b><br />{get(keyTerms, 'legalBusinessName') || 'NA'}</p>
          </Grid.Column>
          <Grid.Column>
            <p>
              {get(campaign, 'regulation')
                && CAMPAIGN_REGULATION_DETAILED.TOOLTIP[campaign.regulation]
                ? (
                  <PopUpModal
                    customTrigger={<span className="popup-label"><b className={newLayout ? 'neutral-text' : ''}>{campaignStatus.isFund ? 'Type of Fund' : 'Type of Offering'}</b></span>}
                    content={CAMPAIGN_REGULATION_DETAILED.TOOLTIP[campaign.regulation]}
                    position="top center"
                    showOnlyPopup={!isMobile}
                    hoverable
                  />
                ) : <b className={newLayout ? 'neutral-text' : ''}>{campaignStatus.isFund ? 'Type of Fund' : 'Type of Offering'}</b>
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
                  title={type.popupContent
                    && (
                      <PopUpModal
                        customTrigger={<span className="popup-label">{type.label}</span>}
                        content={type.popupContent}
                        position="top center"
                        showOnlyPopup={!isMobile}
                      />
                    )
                  }
                />
              </React.Fragment>
            ))
            }
            {!campaignStatus.isFund
              && (
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
              )}
            <KeyTermsFieldHoc
              data={keyTerms}
              field="securities"
              title="Type of Securities"
              content={
                CAMPAIGN_SECURITIES_DETAILED.TOOLTIP[offerStructure]
                ? (
                <PopUpModal
                  customTrigger={<span className="popup-label">{offerStructure ? CAMPAIGN_SECURITIES_DETAILED.SECURITIES[offerStructure] : 'NA'}</span>}
                  content={CAMPAIGN_SECURITIES_DETAILED.TOOLTIP[keyTerms.securities]}
                  position="top center"
                  showOnlyPopup={!isMobile}
                  hoverable
                />
                )
                : (
                  <span>{offerStructure ? CAMPAIGN_SECURITIES_DETAILED.SECURITIES[offerStructure] : 'NA'}</span>
                )
              }
            />
            {campaignStatus.isEquity
            && (
              <KeyTermsFieldHoc
                data={keyTerms}
                field="equityClass"
                title="Equity Class"
                content={get(keyTerms, 'equityClass') && CAMPAIGN_KEYTERMS_EQUITY_CLASS[get(keyTerms, 'equityClass')]}
              />
            )}
            <KeyTermsFieldHoc
              data={keyTerms}
              field="investmentMultiple"
              title={(
                <PopUpModal
                  customTrigger={<span className="popup-label">Investment Multiple</span>}
                  content={<>This is the multiple of your original investment that the Issuer has agreed to pay back prior to maturity. The Issuer pays a portion of their gross revenues every month until the Investment Multiple is achieved. <a target="_blank" href="/resources/education-center/investor/how-revenue-sharing-notes-work">Learn more</a></>}
                  position="top center"
                  showOnlyPopup={!isMobile}
                  hoverable
                />
              )}
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
              title={(
                <PopUpModal
                  customTrigger={<span className="popup-label">Revenue Sharing Percentage</span>}
                  content={<>This is the percentage of gross revenue that is dedicated to paying back investors. So long as the Issuer has revenue, payments will be made to investors monthly until the total Investment Multiple is reached. <a target="_blank" href="/resources/education-center/investor/how-revenue-sharing-notes-work">Learn more</a></>}
                  position="top center"
                  showOnlyPopup={!isMobile}
                  hoverable
                />
              )}
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
              title={(
                <PopUpModal
                  customTrigger={<span className="popup-label">Valuation Cap</span>}
                  content={<>The Valuation Cap is the maximum valuation of the Issuer that may be used when converting your investment to equity. If a future valuation event occurs (i.e. a priced equity round or a sale of the business), and the future valuation of the business is higher than the Valuation Cap, then the investment converts to equity as if the investor invested at the lower valuation.</>}
                  position="top center"
                  showOnlyPopup={!isMobile}
                />
              )}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="discount"
              title={(
                <PopUpModal
                  customTrigger={<span className="popup-label">Discount</span>}
                  content={<>In certain circumstances, an investment may convert to equity at a discount to the valuation used in connection with the applicable valuation event.  If a future valuation event occurs (i.e. a priced equity round or a sale of the business), and the future valuation of the business is lower than the Valuation Cap (or when there is no Valuation Cap), then the Discount will be applied to the future valuation to determine the valuation at which your investment will convert to equity.</>}
                  position="top center"
                  showOnlyPopup={!isMobile}
                />
              )}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="interestRate"
              title={(
                <PopUpModal
                  customTrigger={<span className="popup-label">Annualized Interest Rate</span>}
                  content={keyTerms && keyTerms.securities === 'TERM_NOTE' ? (<>This is the gross annualized interest rate used to calculate monthly payments to investors. <a target="_blank" href="/resources/education-center/investor/how-term-notes-work">Learn more</a></>) : (<>This is the gross annualized interest rate used to calculate monthly payments to investors.</>)}
                  position="top center"
                  showOnlyPopup={!isMobile}
                  hoverable
                />
              )}
              content={keyTerms && keyTerms.interestRate ? `${keyTerms.interestRate}%` : 'NA'}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="maturity"
              title={(
                <PopUpModal
                  customTrigger={<span className="popup-label">Maturity</span>}
                  content={<>This is the deadline by which the issuer is obligated to make payment in full to investors.</>}
                  position="top center"
                  showOnlyPopup={!isMobile}
                />
              )}
              content={(
                <>
                  {keyTerms && keyTerms.maturity ? `${keyTerms.maturity} months` : 'N/A'}
                  {
                    keyTerms && keyTerms.startupPeriod
                    && `, including a ${keyTerms.startupPeriod}-month startup period for ramp up`
                  }
                </>
              )}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="totalRoundSize"
              title={(
                <PopUpModal
                  customTrigger={<span className="popup-label">Total Round Size</span>}
                  content={<>This is the total amount of capital being raised by the business in this round of financing.</>}
                  position="top center"
                  showOnlyPopup={!isMobile}
                />
              )}
              content={(
                <p>
                  {Helper.CurrencyFormat(keyTerms.totalRoundSize, 0)}
                </p>
              )}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="premoneyValuation"
              title={(
                <PopUpModal
                  customTrigger={<span className="popup-label">Pre-Money Valuation</span>}
                  content={<>This is the valuation of the business immediately prior to this round of financing.</>}
                  position="top center"
                  showOnlyPopup={!isMobile}
                />
              )}
              content={(
                <p>
                  {Helper.CurrencyFormat(keyTerms.premoneyValuation, 0)}
                </p>
              )}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="priceCopy"
              title={`${capitalize(keyTerms.equityUnitType)} Price`}
              content={(
                <p>
                  {keyTerms.priceCopy}
                </p>
              )}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="frequencyOfPayments"
              title={(
                <PopUpModal
                  customTrigger={<span className="popup-label">Payments</span>}
                  content={<>This is the frequency with which payments will be made to investors. Typically, payments begin after the first full month following the close of the campaign or after a designated Startup Period. View the Disclosure Statement for details.<a target="_blank" href="/resources/education-center/investor/how-term-notes-work">View Details</a></>}
                  position="top center"
                  showOnlyPopup={!isMobile}
                  hoverable
                />
              )}
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
              content={keyTerms && keyTerms.securityInterest ? keyTerms.securityInterest : ' NA'}
              title={(
                <PopUpModal
                  customTrigger={<span className="popup-label">Security Interest</span>}
                  content={<>The Issuer will grant a security interest in its assets in favor of NextSeed for the benefit of the investors to secure the Issuer’s obligations under the Securities.<a target="_blank" href="/resources/education-center/investor/how-term-notes-work">View Details</a></>}
                  position="top center"
                  showOnlyPopup={!isMobile}
                  hoverable
                />
              )}
            />
            {!campaignStatus.isPreferredEquity
              && (
                <KeyTermsFieldHoc
                  data={keyTerms}
                  field="offeringSize"
                  title="Offering Size"
                  content={(
                    <p>
                      {keyTerms && keyTerms.offeringSize ? Helper.CurrencyFormat(keyTerms.offeringSize, 0)
                        : 'NA'}
                    </p>
                  )}
                />
              )
            }
            <KeyTermsFieldHoc
              data={keyTerms}
              field="preferredReturn"
              title="Preferred Return"
              content={(
                <p>
                  {keyTerms && keyTerms.preferredReturn ? `${keyTerms.preferredReturn}%`
                    : 'NA'}
                </p>
              )}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              field="targetInvestmentPeriod"
              title="Targeted Investment Period"
              content={(
                <p>
                  {keyTerms && keyTerms.targetInvestmentPeriod ? `${keyTerms.targetInvestmentPeriod} months`
                    : 'NA'}
                </p>
              )}
            />
            <KeyTermsFieldHoc
              data={keyTerms}
              title="Ownership % Represented by Securities"
              content={keyTerms && keyTerms.securitiesOwnershipPercentage
                ? (
                  <p>{keyTerms.securitiesOwnershipPercentage}% {' '}
                    equity interests in the Issuer or
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
                  <Table.Cell width={7} className="neutral-text"><div className="parsed-data overflow-wrap"><b>{item.label}{' '}</b></div>
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
        {!newLayout && campaignStatus.isTermNote
          ? (
            <TotalPaymentCalculator {...this.props} />
          )
          : !newLayout && campaignStatus.isRevenueShare && campaignStatus.revenueSharingSummary
            ? (
              <RevenueSharingSummaryBlock {...this.props} />
            )
            : null}
      </>
    );
  }
}

export default KeyTermsDetails;
