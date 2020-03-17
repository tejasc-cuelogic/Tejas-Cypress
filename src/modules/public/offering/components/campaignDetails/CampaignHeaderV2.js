import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { withRouter, Link, Route } from 'react-router-dom';
import { Responsive, Icon, Header, Container, Progress, Popup, Statistic, Grid, Button, Divider, Menu } from 'semantic-ui-react';
import { NavItems } from '../../../../../theme/layout/NavigationItems';
import share from './Share';
// import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../constants/offering';
import { Image64, PopUpModal } from '../../../../../theme/shared';
import Helper from '../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 992;
@inject('campaignStore', 'authStore', 'accreditationStore')
@withRouter
@observer
export default class CampaignHeaderV2 extends Component {
  handleInvestNowClick = () => {
    this.props.accreditationStore.setFieldVal('disabeleElement', false);
    this.props.campaignStore.setFieldValue('isInvestBtnClicked', true);
    this.props.history.push(`${this.props.match.url}/invest-now`);
  }

  render() {
    const { campaignStore, newLayout, followBtn } = this.props;
    const { campaign, campaignStatus, campaignSideBarShow, navCountData } = campaignStore;
    const {
      isClosed, isCreation, isEarlyBirdRewards, isInProcessing, collected, minFlagStatus,
      minOffering, maxFlagStatus, maxOffering, earlyBird, bonusRewards, address, percent,
      percentBefore, diffForProcessing, countDown, investmentSummary, isBonusReward,
      // dataRooms,
    } = campaignStatus;
    return (
      <>
        {!isMobile
          ? (
            <>
            <div className="campaign-banner">
              {get(campaign, 'header.heroBackgroundImage.url')
                && <Image64 bg className="campaign-details-banner" srcUrl={get(campaign, 'header.heroBackgroundImage.url')} />
              }
              <section className="banner">
                <Responsive minWidth={768} as={Container}>
                  <Grid relaxed stackable centered>
                    <Grid.Column width={9}>
                      <div className="video-wrapper campaign">
                        {get(campaign, 'header.heroVideoURL')
                          ? (
                            <Link to={`${this.props.match.url}${newLayout ? '' : '/overview'}/herovideo`}>
                              <Image64
                                bg
                                srcUrl={get(campaign, 'header.heroImage.url')}
                                imgType="heroImage"
                              />
                              <Icon className="ns-play play-icon" />
                            </Link>
                          )
                          : (
                            <Image64
                              bg
                              srcUrl={get(campaign, 'header.heroImage.url')}
                              imgType="heroImage"
                            />
                          )
                        }
                        {get(campaign, 'header.toggleMeta[0]')
                          ? (
                            <div className="offer-stats">
                              <Statistic.Group>
                                <>
                                  {get(campaign, 'header.toggleMeta').includes('DAYS_LEFT')
                                    && (
                                      <Statistic size="mini" className="basic">
                                        <Statistic.Value>{countDown.valueToShow}</Statistic.Value>
                                        <Statistic.Label>{countDown.labelToShow}</Statistic.Label>
                                      </Statistic>
                                    )}
                                  {get(campaign, 'header.toggleMeta').includes('INVESTOR_COUNT')
                                    && (
                                      <Statistic size="mini" className="basic">
                                        <Statistic.Value>
                                          {get(campaign, 'closureSummary.totalInvestorCount') || 0}
                                        </Statistic.Value>
                                        <Statistic.Label>Investors</Statistic.Label>
                                      </Statistic>
                                    )}
                                </>
                                {get(campaign, 'header.toggleMeta').includes('REPAYMENT_COUNT') && isClosed && get(campaign, 'closureSummary.repayment.count') > 0
                                  && (
                                    <Statistic size="mini" className="basic">
                                      <Statistic.Value>
                                        {get(campaign, 'closureSummary.repayment.count') || 0}
                                      </Statistic.Value>
                                      <Statistic.Label>Payments made</Statistic.Label>
                                    </Statistic>
                                  )
                                }
                                {get(campaign, 'header.toggleMeta').includes('EARLY_BIRD') && earlyBird && earlyBird.available > 0
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
                          ) : null}
                      </div>
                      <div className="clearfix social-links mt-10">
                        {campaign && get(campaign, 'misc.social')
                          ? campaign.misc.social.map(site => (
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
                        <Header.Subheader>{address}</Header.Subheader>
                      </Header>
                      <Statistic inverted size="tiny" className={`${isMobile && 'mt-40'} basic mb-0`}>
                        <Statistic.Value>
                          <span className="highlight-text">{Helper.CurrencyFormat(collected, 0)}</span> raised
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
                        ) : null}
                      {!campaignStatus.isFund
                        ? (
                          <p>{Helper.CurrencyFormat(minFlagStatus ? maxOffering : minOffering, 0)} {minFlagStatus ? 'max target' : 'min target'} {' '}
                            <Popup
                              trigger={<Icon name="help circle" color="green" />}
                              content={!minFlagStatus ? 'If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account.' : 'The offering will remain open until the issuer raises the maximum goal or the offering period ends. As long as the raise exceeds the minimum goal, the issuer will receive the funds.'}
                              position="top center"
                            />
                          </p>
                        )
                        : (
                          <>
                            <p>
                              <span className="mr-10">{Helper.CurrencyFormat(minOffering, 0)} {'min target'} {' '}
                                <Popup
                                  trigger={<Icon name="help circle" color="green" />}
                                  content="If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account."
                                  position="top center"
                                />
                              </span>
                              |
                            <span className="ml-10">{Helper.CurrencyFormat(maxOffering, 0)} {'max target'} {' '}
                                <Popup
                                  trigger={<Icon name="help circle" color="green" />}
                                  content="The offering will remain open until the issuer raises the maximum goal or the offering period ends. As long as the raise exceeds the minimum goal, the issuer will receive the funds."
                                  position="top center"
                                />
                              </span>
                            </p>
                          </>
                        )}
                      {get(campaign, 'header.meta[0]') && get(campaign, 'header.meta').map(row => (
                        <>
                          {(
                            <p className="mb-0">
                              {`${row.keyLabel || ''}:`} {row.keyType === 'custom' ? row.keyValue : Helper.formatValue(row.keyFormat, Helper.enumToText(row.keyValue, get(campaign, row.keyValue)))}
                            </p>
                          )}
                        </>
                      ))
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
                          )
                        }
                      </div>
                    </Grid.Column>
                  </Grid>
                </Responsive>
              </section>
            </div>
            </>
          ) : (
            <div className={`${campaignSideBarShow ? '' : 'collapse'} ${isMobile ? 'mobile-campain-header' : 'sticky-sidebar'} ${newLayout ? 'offering-layout-menu' : ''} offering-side-menu `}>
              <Responsive maxWidth={991} as={React.Fragment}>
                <div className={`${newLayout && isMobile ? 'offering-intro-v2' : ''} offering-intro center-align`}>
                  <Header as="h4" inverted>
                    {campaign && campaign.keyTerms && campaign.keyTerms.shorthandBusinessName}
                    {!campaignStatus.isFund && address && <Header.Subheader>{address}</Header.Subheader>}
                  </Header>
                  <div className="video-wrapper campaign">
                    {get(campaign, 'header.heroVideoURL')
                      ? (
                        <Link to={`${this.props.match.url}${newLayout ? '' : '/overview'}/herovideo`}>
                          <Image64
                            bg
                            srcUrl={get(campaign, 'header.heroImage.url')}
                            imgType="heroImage"
                          />
                          <Icon className="ns-play play-icon" />
                        </Link>
                      )
                      : (
                        <Image64
                          bg
                          srcUrl={get(campaign, 'header.heroImage.url')}
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
                      <p className={newLayout ? 'mt-10' : ''}>{Helper.CurrencyFormat(minFlagStatus ? maxOffering : minOffering, 0)} {minFlagStatus ? 'max target' : 'min target'} {' '}
                        {isMobile
                          ? (<PopUpModal label={minFlagStatus ? 'Max target' : 'Min target'} content="If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account." />)
                          : (
                            <Popup
                              trigger={<Icon name="help circle" color="green" />}
                              content="If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account."
                              position="top center"
                            />
                          )
                        }
                      </p>
                    ) : (
                      <>
                        <p className={`${newLayout ? 'mt-10' : ''} mr-10`}>
                          {Helper.CurrencyFormat(minOffering, 0)} {'min target'} {' '}
                          <Popup
                            trigger={<Icon name="help circle" color="green" />}
                            content="If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account."
                            position="top center"
                          />
                        </p>
                        <p className={`${newLayout ? 'mt-10' : ''} mr-10`}>
                          {Helper.CurrencyFormat(maxOffering, 0)} {'max target'} {' '}
                          <Popup
                            trigger={<Icon name="help circle" color="green" />}
                            content="The offering will remain open until the issuer raises the maximum goal or the offering period ends. As long as the raise exceeds the minimum goal, the issuer will receive the funds."
                            position="top center"
                          />
                        </p>
                      </>
                    )}
                  {get(campaign, 'header.toggleMeta[0]')
                    ? (
                      <div className="offer-stats">
                        <Statistic.Group>
                          <>
                            {get(campaign, 'header.toggleMeta').includes('DAYS_LEFT')
                              && (
                                <Statistic size="mini" className="basic">
                                  <Statistic.Value>{countDown.valueToShow}</Statistic.Value>
                                  <Statistic.Label>{countDown.labelToShow}</Statistic.Label>
                                </Statistic>
                              )}
                            {get(campaign, 'header.toggleMeta').includes('INVESTOR_COUNT')
                              && (
                                <Statistic size="mini" className="basic">
                                  <Statistic.Value>
                                    {get(campaign, 'closureSummary.totalInvestorCount') || 0}
                                  </Statistic.Value>
                                  <Statistic.Label>Investors</Statistic.Label>
                                </Statistic>
                              )}
                          </>
                          {get(campaign, 'header.toggleMeta').includes('REPAYMENT_COUNT') && isClosed && get(campaign, 'closureSummary.repayment.count') > 0
                            && (
                              <Statistic size="mini" className="basic">
                                <Statistic.Value>
                                  {get(campaign, 'closureSummary.repayment.count') || 0}
                                </Statistic.Value>
                                <Statistic.Label>Payments made</Statistic.Label>
                              </Statistic>
                            )
                          }
                          {get(campaign, 'header.toggleMeta').includes('EARLY_BIRD') && earlyBird && earlyBird.available > 0
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
                    ) : null}
                  {get(campaign, 'header.meta[0]') && get(campaign, 'header.meta').map((row, i) => (
                    <>
                      {(
                        <p className={`${i === 0 ? 'mt-20' : ''} mb-0`}>
                          {`${row.keyLabel || ''}:`} {row.keyType === 'custom' ? row.keyValue : Helper.formatValue(row.keyFormat, Helper.enumToText(row.keyValue, get(campaign, row.keyValue)))}
                        </p>
                      )}
                    </>
                  ))
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
                )
              }
              <Route path={`${this.props.match.url}/share`} component={share} />
            </div>
          )}
      </>
    );
  }
}
