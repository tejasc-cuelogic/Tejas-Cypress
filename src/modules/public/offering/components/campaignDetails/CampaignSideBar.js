import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Route, Link } from 'react-router-dom';
import { get, capitalize } from 'lodash';
import { Header, Icon, Statistic, Button, Menu, Responsive, Progress, Divider } from 'semantic-ui-react';
import { NavItems } from '../../../../../theme/layout/NavigationItems';
import Helper from '../../../../../helper/utility';
import share from './Share';
import { Image64, PopUpModal } from '../../../../../theme/shared';
import { CAMPAIGN_SECURITIES_DETAILED } from '../../../../../constants/offering';

const isMobile = document.documentElement.clientWidth < 992;

@inject('campaignStore', 'authStore', 'accreditationStore')
@withRouter
@observer
export default class CampaignSideBar extends Component {
  handleInvestNowClick = () => {
    this.props.accreditationStore.setFieldVal('disabeleElement', false);
    this.props.campaignStore.setFieldValue('isInvestBtnClicked', true);
    this.props.history.push(`${this.props.match.url}/invest-now`);
  }

  render() {
    const { campaignStore, newLayout, followBtn } = this.props;
    const { campaign, postNavCount, campaignSideBarShow, offerStructure, campaignStatus } = campaignStore;
    const { keyTerms } = campaign;
    const {
      isClosed, isCreation, isInProcessing, collected, minFlagStatus, isBonusReward,
      minOffering, maxFlagStatus, maxOffering, address, percent, percentBefore, diffForProcessing,
      earlyBird, isEarlyBirdRewards, bonusRewards, countDown, investmentSummary, dataRooms,
    } = campaignStatus;
    const isCampaignLayout = newLayout;
    const showCounter = (!isClosed && diffForProcessing.value > 0 && !campaignStatus.isFund) || (!campaignStatus.isFund) || (earlyBird && earlyBird.available > 0
      && isEarlyBirdRewards && !isClosed && bonusRewards);
    return (
      <>
        <div className={`${campaignSideBarShow ? '' : 'collapse'} ${isMobile ? 'mobile-campain-header' : 'sticky-sidebar'} ${isCampaignLayout ? 'offering-layout-menu' : ''} offering-side-menu `}>
          <Responsive maxWidth={991} as={React.Fragment}>
            <div className={`${newLayout && isMobile ? 'offering-intro-v2' : ''} offering-intro center-align`}>
              <Header as="h4" inverted>
                {campaign && campaign.keyTerms && campaign.keyTerms.shorthandBusinessName}
                {!campaignStatus.isFund && address && <Header.Subheader>{address}</Header.Subheader>}
              </Header>
              <div className="video-wrapper campaign">
                {campaign && campaign.media
                  && campaign.media.heroVideo && campaign.media.heroVideo.url
                  ? (
                    <Link to={`${this.props.match.url}${newLayout ? '' : '/overview'}/herovideo`}>
                      <Image64
                        bg
                        srcUrl={get(campaign, 'media.heroImage.url')}
                        imgType="heroImage"
                      />
                      <Icon className="ns-play play-icon" />
                    </Link>
                  )
                  : (
                    <Image64
                      bg
                      srcUrl={get(campaign, 'media.heroImage.url')}
                      imgType="heroImage"
                    />
                  )
                }
              </div>
              <Statistic inverted size="tiny" className={`${isMobile && 'mt-30'} basic mb-0`}>
                <Statistic.Value>
                  <span className="highlight-text">{Helper.CurrencyFormat(collected, 0)}</span> {!campaignStatus.isFund ? 'raised' : 'invested'}
                </Statistic.Value>
                {minFlagStatus
                  && (
                    <Statistic.Label className="flag-status">
                      <Icon name="flag" /> Surpassed minimum goal
                  </Statistic.Label>
                  )
                }
              </Statistic>
              {!campaignStatus.isFund
                ? (
                  !isClosed
                    ? <Progress className={`${(newLayout && isMobile) ? 'mt-40' : ''} mb-0`} percent={minFlagStatus ? percent : 0} size="tiny" color="green"><span className="sub-progress" style={{ width: `${minFlagStatus ? percentBefore : percent}%` }} /></Progress>
                    : <Progress className={`${(newLayout && isMobile) ? 'mt-40' : ''} mb-0`} percent="100" size="tiny" color="green" />
                ) : null
              }
              {!campaignStatus.isFund
                ? (
                  <>
                    <p>
                      {Helper.CurrencyFormat(minFlagStatus ? maxOffering : minOffering, 0)}{' '}
                      <PopUpModal
                        customTrigger={<span className="popup-label">{minFlagStatus ? 'max target' : 'min target'}</span>}
                        content={!minFlagStatus ? 'This is the minimum fundraising goal. If this amount is not raised by the end of the offering period, any funds invested will be automatically returned to your NextSeed account.' : 'This is the maximum fundraising goal. The offering will remain open until the issuer raises the Offering Max or the offering period ends. As long as the raise exceeds the Offering Min, the issuer will receive the funds.'}
                        position="top center"
                        showOnlyPopup={!isMobile}
                      />
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      {Helper.CurrencyFormat(minOffering, 0)}{' '}
                      <PopUpModal
                        customTrigger={<span className="popup-label">min target</span>}
                        content="This is the minimum fundraising goal. If this amount is not raised by the end of the offering period, any funds invested will be automatically returned to your NextSeed account."
                        position="top center"
                        showOnlyPopup={!isMobile}
                      />
                    </p>
                    <p>
                      {Helper.CurrencyFormat(maxOffering, 0)}{' '}
                      <PopUpModal
                        customTrigger={<span className="popup-label">max target</span>}
                        content="This is the maximum fundraising goal. The offering will remain open until the issuer raises the Offering Max or the offering period ends. As long as the raise exceeds the Offering Min, the issuer will receive the funds."
                        position="top center"
                        showOnlyPopup={!isMobile}
                      />
                    </p>
                  </>
                )}
              {showCounter
                && (
                  <div className="offer-stats">
                    <Statistic.Group>
                      {!campaignStatus.isFund
                        ? (
                          <>
                            {!isClosed && diffForProcessing.value > 0
                              && (
                                <Statistic size="mini" className="basic">
                                  <Statistic.Value>{countDown.valueToShow}</Statistic.Value>
                                  <Statistic.Label>{countDown.labelToShow}</Statistic.Label>
                                </Statistic>
                              )
                            }
                            <Statistic size="mini" className="basic">
                              <Statistic.Value>
                                {get(campaign, 'closureSummary.totalInvestorCount') || 0}
                              </Statistic.Value>
                              <Statistic.Label>Investors</Statistic.Label>
                            </Statistic>
                          </>
                        )
                        : null
                      }
                      {earlyBird && earlyBird.available > 0
                        && isEarlyBirdRewards && !isClosed
                        && bonusRewards
                        ? (
                          <Statistic size="mini" className="basic">
                            <Statistic.Value>
                              {get(campaign, 'earlyBird.available') || 0}
                            </Statistic.Value>
                            <Statistic.Label>Early Bird Rewards</Statistic.Label>
                          </Statistic>
                        ) : ''
                      }
                    </Statistic.Group>
                  </div>
                )
              }
              {CAMPAIGN_SECURITIES_DETAILED.TOOLTIP[offerStructure]
              ? (
                <p className="raise-type mb-0">
                  <PopUpModal
                    customTrigger={<span className="popup-label">{campaignStatus.isRealEstate ? 'Commercial Real Estate' : campaignStatus.isPreferredEquity ? CAMPAIGN_SECURITIES_DETAILED.SECURITIES.PREFERRED_EQUITY_506C : CAMPAIGN_SECURITIES_DETAILED.SECURITIES[offerStructure]}</span>}
                    content={CAMPAIGN_SECURITIES_DETAILED.TOOLTIP[keyTerms.securities]}
                    position="top center"
                    showOnlyPopup={!isMobile}
                  />
                </p>
                ) : (
                  <p className="raise-type mb-0">{campaignStatus.isRealEstate ? 'Commercial Real Estate' : campaignStatus.isPreferredEquity ? CAMPAIGN_SECURITIES_DETAILED.SECURITIES.PREFERRED_EQUITY_506C : CAMPAIGN_SECURITIES_DETAILED.SECURITIES[offerStructure]}</p>
                )
              }
              {campaignStatus.isRealEstate
                && (
                  <p className="mb-0">
                    Asset Type: Hotel Development
                        </p>
                )
              }
              {campaignStatus.isRealEstate && dataRooms > 0
                && (
                  <p className="mb-0">
                    Targeted IRR: <Link to={`${this.props.match.url}#data-room`}> View in Data Room</Link>
                  </p>
                )
              }
              {campaignStatus.isSafe
                && (
                  <>
                    {get(campaign, 'keyTerms.valuationCap') && (
                      <p className="mb-0">
                        <PopUpModal
                          customTrigger={<span className="popup-label">Valuation Cap:</span>}
                          content={<>The Valuation Cap is the maximum valuation of the Issuer that may be used when converting your investment to equity. If a future valuation event occurs (i.e. a priced equity round or a sale of the business), and the future valuation of the business is higher than the Valuation Cap, then the investment converts to equity as if the investor invested at the lower valuation.</>}
                          position="top center"
                          showOnlyPopup={!isMobile}
                        />
                        {' '}{get(campaign, 'keyTerms.valuationCap')}
                      </p>
                    )}
                    {get(campaign, 'keyTerms.discount') && (
                      <p className="mb-0">
                        <PopUpModal
                          customTrigger={<span className="popup-label">Discount:</span>}
                          content={<>In certain circumstances, an investment may convert to equity at a discount to the valuation used in connection with the applicable valuation event.  If a future valuation event occurs (i.e. a priced equity round or a sale of the business), and the future valuation of the business is lower than the Valuation Cap (or when there is no Valuation Cap), then the Discount will be applied to the future valuation to determine the valuation at which your investment will convert to equity.</>}
                          position="top center"
                          showOnlyPopup={!isMobile}
                        />
                        {' '}{get(campaign, 'keyTerms.discount')}
                      </p>
                    )}
                  </>
                )
              }
              {campaignStatus.isTermNote
                && (
                  <p className="mb-0">
                    <PopUpModal
                      customTrigger={<span className="popup-label">Interest Rate:</span>}
                      content={<>This is the gross annualized interest rate used to calculate monthly payments to investors. <a target="_blank" href="/resources/education-center/investor/how-term-notes-work">Learn more</a></>}
                      position="top center"
                      showOnlyPopup={!isMobile}
                    />
                    {' '}{get(campaign, 'keyTerms.interestRate') ? (get(campaign, 'keyTerms.interestRate').includes('%') ? get(campaign, 'keyTerms.interestRate') : `${get(campaign, 'keyTerms.interestRate')}%`) : '-'}
                  </p>
                )
              }
              {campaignStatus.isRevenueShare
                && (
                  <p className="mb-0">
                    <PopUpModal
                      customTrigger={<span className="popup-label">Investment Multiple:</span>}
                      content={<>This is the multiple of your original investment that the Issuer has agreed to pay back prior to maturity. The Issuer pays a portion of their gross revenues every month until the Investment Multiple is achieved. <a target="_blank" href="/resources/education-center/investor/how-revenue-sharing-notes-work">Learn more</a></>}
                      position="top center"
                      showOnlyPopup={!isMobile}
                    />
                    {' '}{get(campaign, 'keyTerms.investmentMultiple') ? get(campaign, 'keyTerms.investmentMultiple') : '-'}
                  </p>
                )
              }
              {(campaignStatus.isRevenueShare || campaignStatus.isTermNote)
                ? (
                  <p className="mb-0">
                    <PopUpModal
                      customTrigger={<span className="popup-label">Maturity:</span>}
                      content={<>This is the deadline by which the issuer is obligated to make payment in full to investors.</>}
                      position="top center"
                      showOnlyPopup={!isMobile}
                    />
                    {' '}{get(campaign, 'keyTerms.maturity') || '-'} months
                  </p>
                )
                : campaignStatus.isPreferredEquity ? (
                  <>
                    <p className="mb-0">
                      <PopUpModal
                        customTrigger={<span className="popup-label">Pre-Money Valuation:</span>}
                        content={<>This is the valuation of the business immediately prior to this round of financing.</>}
                        position="top center"
                        showOnlyPopup={!isMobile}
                      />
                      {' '}{get(campaign, 'keyTerms.premoneyValuation') ? Helper.CurrencyFormat(get(campaign, 'keyTerms.premoneyValuation'), 0) : '-'}
                    </p>
                    <p className="mb-0">
                      {`${capitalize(get(campaign, 'keyTerms.equityUnitType'))} Price:`} {get(campaign, 'keyTerms.priceCopy') || '-'}
                    </p>
                  </>
                )
                  : null
              }
              <Divider hidden />
              {isCreation
                ? <Button fluid secondary={diffForProcessing.value !== 0} content="Coming Soon" disabled />
                : ''
              }
              {!isClosed
                && (
                  <>
                    <Button.Group vertical>
                      {(!get(investmentSummary, 'isInvestedInOffering') || (get(investmentSummary, 'isInvestedInOffering') && (!get(investmentSummary, 'tranche') || get(investmentSummary, 'tranche') < 1)))
                      && (
                      <>
                      <Button
                        primary={!isInProcessing}
                        disabled={maxFlagStatus || isInProcessing}
                        onClick={this.handleInvestNowClick}
                        fluid
                      >
                        {`${isInProcessing ? 'Processing' : maxFlagStatus ? 'Fully Reserved' : get(investmentSummary, 'isInvestedInOffering') ? 'Change Investment' : 'Invest Now'}`}
                      </Button>
                      <p className="mt-10">
                        {Helper.CurrencyFormat(get(campaign, 'keyTerms.minInvestAmt'), 0)} min investment
                      </p>
                      </>
                      )}
                      {followBtn}
                    </Button.Group>
                  </>
                )
              }
            </div>
          </Responsive>
          {!isMobile
            && (
              <>
                <Menu vertical>
                  <NavItems needNavLink sub refLoc="public" refLink={this.props.match.url} location={this.props.location} navItems={this.props.navItems} countData={postNavCount} bonusRewards={isBonusReward} isBonusReward={isBonusReward} />
                </Menu>
              </>
            )}
          <Route path={`${this.props.match.url}/share`} component={share} />
        </div>
      </>
    );
  }
}
