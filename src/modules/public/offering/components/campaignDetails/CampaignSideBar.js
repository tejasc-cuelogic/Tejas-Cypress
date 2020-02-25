import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Route, Link } from 'react-router-dom';
import { get, capitalize } from 'lodash';
import { Header, Icon, Statistic, Button, Menu, Responsive, Progress, Divider } from 'semantic-ui-react';
import { NavItems } from '../../../../../theme/layout/NavigationItems';
import Helper from '../../../../../helper/utility';
import share from './Share';
import { Image64, PopUpModal } from '../../../../../theme/shared';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_EQUITY_CLASS } from '../../../../../constants/offering';

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
    const {
      campaign, navCountData, campaignSideBarShow, offerStructure, campaignStatus,
    } = campaignStore;
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
                )}
              {CAMPAIGN_KEYTERMS_SECURITIES[offerStructure]
                && (
                  <p className="raise-type mt-20 mb-0">
                    {CAMPAIGN_KEYTERMS_SECURITIES[offerStructure]}{campaignStatus.isEquity && ['LLC_MEMBERSHIP_UNITS', 'PREFERRED'].includes(get(campaign, 'keyTerms.equityClass')) ? `  - ${CAMPAIGN_KEYTERMS_EQUITY_CLASS[get(campaign, 'keyTerms.equityClass')]}` : ' '}
                  </p>
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
                        Valuation Cap: {get(campaign, 'keyTerms.valuationCap')}
                      </p>
                    )}
                    {get(campaign, 'keyTerms.discount') && (
                      <p className="mb-0">
                        Discount: {get(campaign, 'keyTerms.discount')}
                      </p>
                    )}
                  </>
                )
              }
              {campaignStatus.isTermNote
                && (
                  <p className="mb-0">
                    Interest Rate: {get(campaign, 'keyTerms.interestRate') ? (get(campaign, 'keyTerms.interestRate').includes('%') ? get(campaign, 'keyTerms.interestRate') : `${get(campaign, 'keyTerms.interestRate')}%`) : '-'}
                  </p>
                )
              }
              {campaignStatus.isRevenueShare
                && (
                  <p className="mb-0">
                    Investment Multiple: {get(campaign, 'keyTerms.investmentMultiple') ? get(campaign, 'keyTerms.investmentMultiple') : '-'}
                  </p>
                )
              }
              {(campaignStatus.isRevenueShare || campaignStatus.isTermNote)
                ? (
                  <p className="mb-0">
                    Maturity: {get(campaign, 'keyTerms.maturity') || '-'} months
                </p>
                )
                : campaignStatus.isPreferredEquity ? (
                  <>
                    <p className="mb-0">
                      Pre-Money Valuation: {get(campaign, 'keyTerms.premoneyValuation') ? Helper.CurrencyFormat(get(campaign, 'keyTerms.premoneyValuation'), 0) : '-'}
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
                  <NavItems needNavLink sub refLoc="public" refLink={this.props.match.url} location={this.props.location} navItems={this.props.navItems} countData={navCountData} bonusRewards={isBonusReward} isBonusReward={isBonusReward} />
                </Menu>
              </>
            )}
          <Route path={`${this.props.match.url}/share`} component={share} />
        </div>
      </>
    );
  }
}
