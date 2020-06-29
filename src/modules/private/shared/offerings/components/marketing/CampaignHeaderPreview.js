import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Responsive, Icon, Header, Container, Progress, Statistic, Grid, Button } from 'semantic-ui-react';
import { Image64, PopUpModal } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';
import { DataFormatter } from '../../../../../../helper';

const isMobile = document.documentElement.clientWidth < 992;
@inject('manageOfferingStore', 'offeringsStore')
@withRouter
@observer
export default class CampaignHeaderPreview extends Component {
  constructor(props) {
    super(props);
    const { offer } = this.props.offeringsStore;
    this.props.manageOfferingStore.setFieldValue('HEADER_BASIC_FRM', offer.stage, 'fields.stage.value');
  }

  render() {
    const { offeringsStore, manageOfferingStore, followBtn, newLayout } = this.props;
    const { offer } = offeringsStore;
    const { HEADER_BASIC_FRM, TOMBSTONE_HEADER_META_FRM, OFFERING_MISC_FRM, campaignStatus } = manageOfferingStore;
    const {
      isInProcessing, collected, minFlagStatus,
      minOffering, maxFlagStatus, maxOffering, address, percent, percentBefore, investmentSummary, diffForProcessing,
      // isEarlyBirdRewards, earlyBird, bonusRewards,
    } = campaignStatus;
    const headerBasicFields = HEADER_BASIC_FRM.fields;
    const isClosed = headerBasicFields.stage.value === 'COMPLETE';
    const isCreation = headerBasicFields.stage.value === 'CREATION';
    const isLive = headerBasicFields.stage.value === 'LIVE';
    const diffForProcessingText = DataFormatter.getDateDifferenceInHoursOrMinutes(headerBasicFields.closeDate.value, true, true);
    const diff = DataFormatter.diffDays(headerBasicFields.closeDate.value || null, false, true);
    const countDown = (['Minute Left', 'Minutes Left'].includes(diffForProcessingText.label) && diffForProcessingText.value > 0) || diffForProcessingText.value <= 48 ? { valueToShow: diffForProcessingText.value, labelToShow: diffForProcessingText.label } : { valueToShow: diff, labelToShow: diff === 1 ? 'Day Left' : 'Days Left' };
    const headerMetaFields = TOMBSTONE_HEADER_META_FRM.fields;
    const miscFields = OFFERING_MISC_FRM.fields;
    const toggleMetaValue = headerBasicFields.toggleMeta.value;
    const isOfferStats = !toggleMetaValue.includes('DAYS_LEFT') || !toggleMetaValue.includes('INVESTOR_COUNT') || !toggleMetaValue.includes('REPAYMENT_COUNT') || !toggleMetaValue.includes('EARLY_BIRD');

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
                    <div className={`${isOfferStats ? 'offer-stats' : ''}`}>
                      <Statistic.Group>
                        <>
                          {isLive && !headerBasicFields.toggleMeta.value.includes('DAYS_LEFT')
                            && (
                              <Statistic size="mini" className="basic">
                                <Statistic.Value>{countDown.valueToShow || 'X'}</Statistic.Value>
                                <Statistic.Label>{countDown.labelToShow || 'Days Left'}</Statistic.Label>
                              </Statistic>
                            )}
                          {!headerBasicFields.toggleMeta.value.includes('INVESTOR_COUNT')
                            && (
                              <Statistic size="mini" className="basic">
                                <Statistic.Value>
                                  {headerBasicFields.investorCount.value || 0}
                                </Statistic.Value>
                                <Statistic.Label>Investors</Statistic.Label>
                              </Statistic>
                            )}
                        </>
                        {isClosed && !headerBasicFields.toggleMeta.value.includes('REPAYMENT_COUNT') && headerBasicFields.repaymentCount.value > 0
                          && (
                            <Statistic size="mini" className="basic">
                              <Statistic.Value>
                                {headerBasicFields.repaymentCount.value || 0}
                              </Statistic.Value>
                              <Statistic.Label>Payments made</Statistic.Label>
                            </Statistic>
                          )
                        }
                        {!isClosed && !headerBasicFields.toggleMeta.value.includes('EARLY_BIRD') && headerBasicFields.earlyBird.value > 0
                          ? (
                            <Statistic size="mini" className="basic">
                              <Statistic.Value>
                                {headerBasicFields.earlyBird.value || 0}
                              </Statistic.Value>
                              <Statistic.Label>Early Bird Rewards</Statistic.Label>
                            </Statistic>
                          ) : ''
                        }
                      </Statistic.Group>
                    </div>
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
                    {!headerBasicFields.toggleMeta.value.includes('BUSINESS_LOCATION')
                      && (<Header.Subheader>{address}</Header.Subheader>)
                    }
                  </Header>
                  <Statistic inverted size="tiny" className={`${isMobile && 'mt-40'} basic mb-0`}>
                    {!headerBasicFields.toggleMeta.value.includes('FUNDINGRAISING_STATE')
                      && (
                        <Statistic.Value>
                          <span className="highlight-text">{Helper.CurrencyFormat(collected, 0)}</span> raised
                        </Statistic.Value>
                      )
                    }
                    {!headerBasicFields.toggleMeta.value.includes('FUNDINGRAISING_STATE') && minFlagStatus
                      && (
                        <Statistic.Label className="flag-status">
                          <Icon name="flag" /> Surpassed minimum goal
                        </Statistic.Label>
                      )
                    }
                  </Statistic>
                  {!campaignStatus.isFund && !headerBasicFields.toggleMeta.value.includes('FUNDINGRAISING_STATE')
                    ? (
                      !isClosed
                        ? <Progress percent={minFlagStatus ? percent : 0} size="tiny" color="green"><span className="sub-progress" style={{ width: `${minFlagStatus ? percentBefore : percent}%` }} /></Progress>
                        : <Progress percent="100" size="tiny" color="green" />
                    ) : null}
                  {!campaignStatus.isFund
                      ? (
                      <>
                        {(minFlagStatus && !headerBasicFields.toggleMeta.value.includes('MAXIMUM_TARGET'))
                          && (
                            <p>
                              {Helper.CurrencyFormat(maxOffering, 0)}{' '}
                              <PopUpModal
                                customTrigger={<span className="popup-label">max target</span>}
                                content="The offering will remain open until the issuer raises the maximum goal or the offering period ends. As long as the raise exceeds the minimum goal, the issuer will receive the funds."
                                position="top center"
                                showOnlyPopup={!isMobile}
                              />
                            </p>
                          )}
                        {
                          (!minFlagStatus && !headerBasicFields.toggleMeta.value.includes('MINIMUM_TARGET'))
                          && (
                            <p>
                              {Helper.CurrencyFormat(minOffering, 0)}{' '}
                              <PopUpModal
                                customTrigger={<span className="popup-label">min target</span>}
                                content="If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account."
                                position="top center"
                                showOnlyPopup={!isMobile}
                              />
                            </p>
                          )
                        }
                      </>
                    ) : (
                      <>
                        <p>
                          <>
                            {!headerBasicFields.toggleMeta.value.includes('MINIMUM_TARGET')
                              && (
                                <span className="mr-10">
                                  {Helper.CurrencyFormat(minOffering, 0)}{' '}
                                  <PopUpModal
                                    customTrigger={<span className="popup-label">min target</span>}
                                    content="If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account."
                                    position="top center"
                                    showOnlyPopup={!isMobile}
                                  />
                                </span>
                              )
                            }
                            {!headerBasicFields.toggleMeta.value.includes('MINIMUM_TARGET') && !headerBasicFields.toggleMeta.value.includes('MAXIMUM_TARGET') && '|'}
                            {!headerBasicFields.toggleMeta.value.includes('MAXIMUM_TARGET')
                              && (
                                <span className="ml-10">
                                  {Helper.CurrencyFormat(maxOffering, 0)}{' '}
                                  <PopUpModal
                                    customTrigger={<span className="popup-label">max target</span>}
                                    content="The offering will remain open until the issuer raises the maximum goal or the offering period ends. As long as the raise exceeds the minimum goal, the issuer will receive the funds."
                                    position="top center"
                                    showOnlyPopup={!isMobile}
                                  />
                                </span>
                              )
                            }
                          </>
                        </p>
                      </>
                    )
                  }
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
                    {isLive
                      && (
                        <>
                          <Grid>
                            {(!get(investmentSummary, 'isInvestedInOffering') || (get(investmentSummary, 'isInvestedInOffering') && (!get(investmentSummary, 'tranche') || get(investmentSummary, 'tranche') < 1)))
                              && (
                                <Grid.Column width={followBtn && !headerBasicFields.toggleMeta.value.includes('FOLLOW_STATE') ? '10' : ''} className="center-align">
                                  <Button
                                    primary={!isInProcessing}
                                    disabled={maxFlagStatus || isInProcessing}
                                    onClick={this.handleInvestNowClick}
                                    fluid
                                  >
                                    {`${isInProcessing ? 'Processing' : maxFlagStatus ? 'Fully Reserved' : get(investmentSummary, 'isInvestedInOffering') ? 'Change Investment' : 'Invest Now'}`}
                                  </Button>
                                  <p className="mt-10">
                                    {Helper.CurrencyFormat(get(offer, 'keyTerms.minInvestAmt'), 0)} {' '}
                                    <PopUpModal
                                      customTrigger={<span className="popup-label">min investment</span>}
                                      content="This is the minimum individual investment amount required to participate in this offering. This amount is set by the Issuer."
                                      position="top center"
                                      showOnlyPopup={!isMobile}
                                    />
                                  </p>
                                </Grid.Column>
                              )}
                            {followBtn && !headerBasicFields.toggleMeta.value.includes('FOLLOW_STATE')
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
