import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Responsive, Icon, Header, Container, Progress, Popup, Statistic, Grid, Button } from 'semantic-ui-react';
// import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../../constants/offering';
import { Image64 } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 992;
@inject('manageOfferingStore', 'offeringsStore')
@withRouter
@observer
export default class CampaignHeaderPreview extends Component {
  render() {
    const { offeringsStore, manageOfferingStore, followBtn, newLayout } = this.props;
    const { offer } = offeringsStore;
    const { HEADER_BASIC_FRM, TOMBSTONE_HEADER_META_FRM, OFFERING_MISC_FRM, campaignStatus } = manageOfferingStore;
    const {
      isClosed, isCreation, isEarlyBirdRewards, isInProcessing, collected, minFlagStatus,
      minOffering, maxFlagStatus, maxOffering, earlyBird, bonusRewards, address, percent,
      percentBefore, diffForProcessing, countDown, investmentSummary,
    } = campaignStatus;
    const headerBasicFields = HEADER_BASIC_FRM.fields;
    const headerMetaFields = TOMBSTONE_HEADER_META_FRM.fields;
    const miscFields = OFFERING_MISC_FRM.fields;
    return (
      <>
        <div className="campaign-banner">
          {headerBasicFields.heroBackgroundImage.preSignedUrl
            && <Image64 originalImg bg className="campaign-details-banner" srcUrl={get(headerBasicFields, 'heroBackgroundImage.preSignedUrl')} />
          }
          <section className="banner">
            <Responsive minWidth={768} as={Container}>
              <Grid relaxed stackable centered>
                <Grid.Column width={9}>
                  <div className="video-wrapper campaign">
                    {headerBasicFields.heroVideoURL.value
                      ? (
                        <>
                          <Image64
                            originalImg
                            bg
                            srcUrl={headerBasicFields.heroImage.preSignedUrl}
                            imgType="heroImage"
                          />
                          <Icon className="ns-play play-icon" />
                        </>
                      )
                      : (
                        <Image64
                          originalImg
                          bg
                          srcUrl={headerBasicFields.heroImage.preSignedUrl}
                          imgType="heroImage"
                        />
                      )
                    }
                    {headerBasicFields.toggleMeta.value && headerBasicFields.toggleMeta.value.length
                    ? (
                      <div className="offer-stats">
                        <Statistic.Group>
                          <>
                          {headerBasicFields.toggleMeta.value.includes('DAYS_LEFT')
                            && (
                            <Statistic size="mini" className="basic">
                              <Statistic.Value>{countDown.valueToShow || 'X'}</Statistic.Value>
                              <Statistic.Label>{countDown.labelToShow || 'Days Left'}</Statistic.Label>
                            </Statistic>
                            )}
                            {headerBasicFields.toggleMeta.value.includes('INVESTOR_COUNT')
                            && (
                            <Statistic size="mini" className="basic">
                              <Statistic.Value>
                                {get(offer, 'closureSummary.totalInvestorCount') || 0}
                              </Statistic.Value>
                              <Statistic.Label>Investors</Statistic.Label>
                            </Statistic>
                            )}
                          </>
                          {headerBasicFields.toggleMeta.value.includes('REPAYMENT_COUNT') && isClosed && get(offer, 'closureSummary.repayment.count') > 0
                            && (
                              <Statistic size="mini" className="basic">
                                <Statistic.Value>
                                  {get(offer, 'closureSummary.repayment.count') || 0}
                                </Statistic.Value>
                                <Statistic.Label>Payments made</Statistic.Label>
                              </Statistic>
                            )
                          }
                          {headerBasicFields.toggleMeta.value.includes('EARLY_BIRD') && earlyBird && earlyBird.available > 0
                            && isEarlyBirdRewards && !isClosed
                            && bonusRewards
                            ? (
                              <Statistic size="mini" className="basic">
                                <Statistic.Value>
                                  {get(offer, 'earlyBird.available') || 0}
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
                    {['facebook_url', 'linkedin_url', 'twitter_url', 'instagram_url', 'yelp_url'].map(field => (
                      <React.Fragment key={field}>
                        {miscFields[field].value
                          && <a target="_blank" rel="noopener noreferrer" href={miscFields[field].value.includes('http') ? miscFields[field].value : `http://${miscFields[field].value}`}><Icon name={(field.split('_'))[0]} /></a>
                        }
                      </React.Fragment>
                    ))}
                    <Link to={`${this.props.match.url}${newLayout ? '' : '/overview'}/photogallery`} onClick={this.handleViewGallery} className="pull-right">
                      View gallery <Icon size="small" className="ns-chevron-right" />
                    </Link>
                  </div>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Header as="h3" inverted>
                    {offer && offer.keyTerms && offer.keyTerms.shorthandBusinessName}
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
                  {headerMetaFields.meta.map(row => (
                    <>
                      {(
                        <p className="mb-0">
                          {row.keyLabel.value && `${row.keyLabel.value}:`} {row.keyType.value === 'custom' ? row.keyValue.value : Helper.formatValue(row.keyFormat.value, Helper.enumToText(row.keyValue.value, get(offer, row.keyValue.value)))}
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
                                {Helper.CurrencyFormat(get(offer, 'keyTerms.minInvestAmt'), 0)} min investment
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
    );
  }
}
