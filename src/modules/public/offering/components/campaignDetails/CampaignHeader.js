import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get, capitalize } from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Responsive, Icon, Header, Container, Progress, Statistic, Grid, Button } from 'semantic-ui-react';
import { CAMPAIGN_SECURITIES_DETAILED } from '../../../../../constants/offering';
import { Image64, PopUpModal } from '../../../../../theme/shared';
import Helper from '../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 992;
@inject('campaignStore', 'authStore', 'accreditationStore')
@withRouter
@observer
export default class CampaignHeader extends Component {
  handleInvestNowClick = () => {
    this.props.accreditationStore.setFieldVal('disabeleElement', false);
    this.props.campaignStore.setFieldValue('isInvestBtnClicked', true);
    this.props.history.push(`${this.props.match.url}/invest-now`);
  }

  render() {
    const { campaignStore, newLayout, followBtn } = this.props;
    const { campaign, offerStructure, campaignStatus } = campaignStore;
    const { keyTerms } = campaign;
    const {
      isClosed, isCreation, isEarlyBirdRewards, isInProcessing, collected, minFlagStatus,
      minOffering, maxFlagStatus, maxOffering, earlyBird, bonusRewards, address, percent,
      percentBefore, diffForProcessing, countDown, investmentSummary, dataRooms,
    } = campaignStatus;
    const showCounter = (!isClosed && diffForProcessing.value > 0 && !campaignStatus.isFund) || (!campaignStatus.isFund) || (isClosed && get(campaign, 'closureSummary.repayment.count') > 0) || (earlyBird && earlyBird.available > 0
      && isEarlyBirdRewards && !isClosed && bonusRewards);
    return (
      <>
        <div className="campaign-banner">
          {get(campaign, 'media.heroBackground.url')
            && <Image64 bg className="campaign-details-banner" srcUrl={get(campaign, 'media.heroBackground.url')} />
          }
          <section className="banner">
            <Responsive minWidth={768} as={Container}>
              <Grid relaxed stackable>
                <Grid.Column width={10}>
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
                                    )}
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
                            {isClosed && get(campaign, 'closureSummary.repayment.count') > 0
                              && (
                                <Statistic size="mini" className="basic">
                                  <Statistic.Value>
                                    {get(campaign, 'closureSummary.repayment.count') || 0}
                                  </Statistic.Value>
                                  <Statistic.Label>Payments made</Statistic.Label>
                                </Statistic>
                              )
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
                  </div>
                  <div className="clearfix social-links mt-10">
                    {campaign && get(campaign, 'offering.overview.social')
                      ? campaign.offering.overview.social.map(site => (
                        <React.Fragment key={site.type}>
                          {site.url
                            && <a target="_blank" rel="noopener noreferrer" href={site.url.includes('http') ? site.url : `http://${site.url}`}><Icon name={site.type.toLowerCase()} /></a>
                          }
                        </React.Fragment>
                      )) : ''}
                    <Link to={`${this.props.match.url}${newLayout ? '' : '/overview'}/photogallery`} onClick={this.handleViewGallery} className="pull-right">
                      View gallery <Icon size="small" className="ns-chevron-right" />
                    </Link>
                  </div>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Header as="h3" inverted>
                    {campaign && campaign.keyTerms && campaign.keyTerms.shorthandBusinessName}
                    {!campaignStatus.isFund && address && <Header.Subheader>{address}</Header.Subheader>}
                  </Header>
                  <Statistic inverted size="tiny" className={`${isMobile && 'mt-40'} basic mb-0`}>
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
                        ? <Progress percent={minFlagStatus ? percent : 0} size="tiny" color="green"><span className="sub-progress" style={{ width: `${minFlagStatus ? percentBefore : percent}%` }} /></Progress>
                        : <Progress percent="100" size="tiny" color="green" />
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
                  {(campaignStatus.isTermNote || campaignStatus.isRevenueShare)
                    && (
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
                  }
                  {campaignStatus.isPreferredEquity
                    && (
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
                  <div className="mt-20">
                    {isCreation
                      ? <Button fluid secondary={diffForProcessing.value !== 0} content="Coming Soon" disabled />
                      : ''
                    }
                    {!isClosed
                      && (
                        <>
                          <Grid>
                            {(!get(investmentSummary, 'isInvestedInOffering') || (get(investmentSummary, 'isInvestedInOffering') && (!get(investmentSummary, 'tranche') || get(investmentSummary, 'tranche') < 1)))
                            && (
                            <Grid.Column width={followBtn ? '10' : ''} className="center-align">
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
                            </Grid.Column>
                            )}
                            {followBtn
                              && (
                                <Grid.Column width="6">
                                  <>{followBtn}</>
                                </Grid.Column>
                              )
                            }
                          </Grid>
                        </>
                      )}
                  </div>
                </Grid.Column>
              </Grid>
            </Responsive>
          </section>
        </div>
      </>
    );
  }
}
