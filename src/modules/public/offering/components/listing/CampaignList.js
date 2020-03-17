/* eslint-disable import/no-dynamic-require, global-require */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get, capitalize } from 'lodash';
import { Container, Card, Grid, Label, Icon, Button, Divider, Table } from 'semantic-ui-react';
// import { IonIcon } from '@ionic/react';
// import { heart } from 'ionicons/icons';
import { InlineLoader, Image64 } from '../../../../../theme/shared';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_SECURITIES_ENUM, CAMPAIGN_OFFERED_BY, CAMPAIGN_KEYTERMS_REGULATION_PARALLEL } from '../../../../../constants/offering';
import Helper from '../../../../../helper/utility';
import NSImage from '../../../../shared/NSImage';
import HtmlEditor from '../../../../shared/HtmlEditor';
import { DataFormatter } from '../../../../../helper';

const keyTermList = [
  { label: 'Security', forFunded: true, key: 'keyTerms.securities', type: CAMPAIGN_KEYTERMS_SECURITIES, for: ['ALL'] },
  { label: 'Offering', key: 'keyTerms.regulation', type: CAMPAIGN_KEYTERMS_REGULATION_PARALLEL, for: ['ALL'] },
  { label: 'Investment Minimum', key: 'keyTerms.minInvestAmt', type: '$', for: ['ALL'] },
  { label: 'Offering Size', key: 'keyTerms.offeringSize', type: '$', for: [], equityClass: ['LLC_MEMBERSHIP_UNITS'] },
  { label: 'Multiple', forFunded: true, key: 'closureSummary.keyTerms.multiple', type: 'X', for: ['REVENUE_SHARING_NOTE'] },
  { label: 'Interest Rate', forFunded: true, key: 'closureSummary.keyTerms.interestRate', type: '%', for: ['TERM_NOTE'] },
  { label: 'Maturity', key: 'keyTerms.maturity', type: 'months', for: ['REVENUE_SHARING_NOTE', 'TERM_NOTE'] },
  { label: 'Pre-Money Valuation', key: 'keyTerms.premoneyValuation', type: '$', for: [], equityClass: ['PREFERRED'] },
  { label: 'Share Price', key: 'keyTerms.priceCopy', type: '', for: [], equityClass: ['PREFERRED'] },
  { label: 'Valuation Cap', key: 'keyTerms.valuationCap', type: '', for: ['CONVERTIBLE_NOTES', 'SAFE'] },
  { label: 'Discount', key: 'keyTerms.discount', type: '', for: ['CONVERTIBLE_NOTES', 'SAFE'] },
  { label: 'Targeted IRR ', value: 'View in Data Room', for: [], equityClass: ['LLC_MEMBERSHIP_UNITS'] },
];

@inject('campaignStore', 'accreditationStore')
@observer
export default class CampaignList extends Component {
  state = { filters: false };

  constructor(props) {
    super(props);
    this.props.accreditationStore.resetUserAccreditatedStatus();
  }

  componentWillUnmount() {
    this.props.campaignStore.resetDisplayCounts();
  }

  toggleFilters = () => {
    const { filters } = this.state;
    this.setState({ filters: filters === false });
  }

  renderBaners = (offering, additionalTag = null) => {
    const resultFound = get(offering, 'isBannerShow');
    const realEstateBanner = get(offering, 'realEstateBanner');
    const customTag = additionalTag ? (<Label color="grey">{additionalTag}</Label>) : null;
    if (resultFound) {
      const bannerFirst = get(offering, 'datesBanner');
      const bannerSecond = get(offering, 'amountsBanner');
      return (
        <Label.Group size="small">
          {customTag}
          {realEstateBanner
            && <Label color="grey">{realEstateBanner}</Label>
          }
          {bannerFirst
            && <Label color={bannerFirst === 'Processing' ? 'grey' : bannerFirst === 'NEW' ? 'blue' : 'green'}>{bannerFirst}</Label>
          }
          {bannerSecond
            && <Label color={bannerFirst === 'Processing' ? 'grey' : 'green'}>{bannerSecond}</Label>
          }
        </Label.Group>
      );
    } if (realEstateBanner) {
      return (
        <Label.Group size="small">
          {customTag}
          <Label color="grey">{realEstateBanner}</Label>
        </Label.Group>
      );
    } if (customTag) {
      return (
      <Label.Group size="small">
        {customTag}
      </Label.Group>
      );
    }
    return null;
  }

  render() {
    const { campaigns, loading, isFunded } = this.props;
    const isTemplate2 = template => template === 2;
    const tombstoneImage = offering => (isTemplate2(get(offering, 'template')) ? get(offering, 'tombstone.image.url') : get(offering, 'media.tombstoneImage.url'));
    const getTombstoneDescription = offering => (isTemplate2(get(offering, 'template')) ? get(offering, 'tombstone.description') : get(offering, 'offering.overview.tombstoneDescription'));
    const showInvestorsCount = offering => (!isTemplate2(get(offering, 'template')) || (isTemplate2(get(offering, 'template')) && (get(offering, 'tombstone.toggleMeta') || []).includes('INVESTOR_COUNT')));
    const getCustomTag = offering => ((isTemplate2(get(offering, 'template')) && get(offering, 'tombstone.customTag')) || '');
    return (
      <>
        <section className="campaign-list-wrapper">
          <Container>
            {this.props.heading}
            {this.props.subheading}
            {loading ? <InlineLoader />
              : campaigns && campaigns.length
                ? (
                  <Grid doubling columns={3} stackable>
                    {campaigns.map(offering => (
                      <Grid.Column key={offering.id} data-cy={offering.offeringSlug}>
                        <Card className="campaign" fluid as={Link} to={`/offerings/${offering.offeringSlug}`}>
                          <div className="campaign-image-wrap">
                            <div className="campaign-card-image">
                              <Image64
                                bg
                                centered
                                srcUrl={tombstoneImage(offering) || ''}
                                alt={`${offering.keyTerms.shorthandBusinessName} poster`}
                              />
                            </div>
                          </div>
                          {offering.stage === 'LIVE' ? this.renderBaners(offering, getCustomTag(offering)) : null}
                          {(['INVESTOR', 'WATCHING'].includes(offering.watchListStatus))
                            && (
                              <Icon name="heart" />
                            )
                          }
                          <div className={`campaign-card-details ${!get(offering, 'isAvailablePublicly') ? 'disabled' : ''}`}>
                            <Card.Content>
                              <Card.Header>{offering && offering.keyTerms
                                && offering.keyTerms.shorthandBusinessName ? offering.keyTerms.shorthandBusinessName : ''
                              }
                              </Card.Header>
                              {get(offering, 'keyTerms.securities') !== CAMPAIGN_KEYTERMS_SECURITIES_ENUM.FUNDS && (get(offering, 'keyTerms.city') || get(offering, 'keyTerms.state'))
                                && (
                                  <Card.Meta>
                                    {get(offering, 'keyTerms.city') || ''}
                                    {get(offering, 'keyTerms.city') && get(offering, 'keyTerms.state') ? ', ' : ''}
                                    {get(offering, 'keyTerms.state') || ''}
                                  </Card.Meta>
                                )}
                              <Card.Description>
                                <HtmlEditor
                                  readOnly
                                  content={getTombstoneDescription(offering) || ''}
                                />
                              </Card.Description>
                              <Divider />
                              <div className="campaign-card-table-wrapper">
                                <Table basic="very" compact="very" unstackable className="no-border campaign-card">
                                  {!isTemplate2(get(offering, 'template'))
                                    ? (
                                      <Table.Body>
                                        {(isFunded ? keyTermList.filter(i => i.forFunded) : keyTermList).map(row => (
                                          <>
                                            {((isFunded || row.for.includes('ALL') || (row.for.includes(offering.keyTerms.securities) || (['EQUITY'].includes(offering.keyTerms.securities) && get(row, 'equityClass') && get(row, 'equityClass').includes(get(offering, 'keyTerms.equityClass'))))) && ((get(offering, row.key) === 0 || get(offering, row.key)) || row.value))
                                              && (
                                                <Table.Row verticalAlign="top">
                                                  <Table.Cell collapsing>{(row.label === 'Share Price') ? `${capitalize(get(offering, 'keyTerms.equityUnitType'))} Price` : (row.label === 'Security' && get(offering, row.key) && ((get(offering, row.key) === 'EQUITY' && get(offering, 'keyTerms.equityClass') === 'LLC_MEMBERSHIP_UNITS'))) ? 'Type of Investment' : row.label}</Table.Cell>
                                                  <Table.Cell collapsing className={`${!isFunded && !row.for.includes('ALL') && row.value !== 'View in Data Room' ? 'highlight-text' : ''} right-align`}>
                                                    <b>
                                                      {((get(offering, row.key) !== undefined && get(offering, row.key) !== null) || row.value)
                                                        ? (
                                                          <>
                                                            {typeof row.type === 'object' ? (
                                                              row.type[get(offering, row.key)]
                                                                && ((get(offering, row.key) === 'EQUITY' && get(offering, 'keyTerms.equityClass') === 'LLC_MEMBERSHIP_UNITS')) ? <>Commercial Real Estate</>
                                                                : ((get(offering, row.key) === 'EQUITY' && get(offering, 'keyTerms.equityClass') === 'PREFERRED')) ? row.type.PREFERRED_EQUITY_506C
                                                                  : row.type[get(offering, row.key)] || '-'
                                                            ) : row.type === '$' ? row.key ? Helper.CurrencyFormat(get(offering, row.key), 0) : row.value
                                                                : row.type === '%' ? row.key ? `${get(offering, row.key)}%` : row.value
                                                                  : row.type === 'X' ? row.key ? `${get(offering, row.key)}x` : row.value
                                                                    : row.type === 'months' ? row.key ? `${get(offering, row.key)} months` : row.value
                                                                      : row.type === 'string' ? row.key ? `${get(offering, row.key)}` : row.value
                                                                        : row.key ? get(offering, row.key) === 0 ? 0 : (get(offering, row.key) || '') : row.value
                                                            }
                                                          </>
                                                        )
                                                        : '-'
                                                      }
                                                    </b>
                                                  </Table.Cell>
                                                </Table.Row>
                                              )
                                            }
                                          </>
                                        ))
                                        }
                                      </Table.Body>
                                    ) : (
                                      <Table.Body>
                                        {get(offering, 'tombstone.meta[0]') && get(offering, 'tombstone.meta').map(row => (
                                          <Table.Row verticalAlign="top">
                                            <Table.Cell collapsing>{row.keyLabel}</Table.Cell>
                                            <Table.Cell className="highlight-text right-align">
                                              <b>{row.keyType === 'custom' ? row.keyValue : Helper.formatValue(row.keyFormat, Helper.enumToText(row.keyValue, get(offering, row.keyValue)))}</b>
                                            </Table.Cell>
                                          </Table.Row>
                                        ))
                                        }
                                      </Table.Body>
                                    )
                                  }
                                </Table>
                              </div>
                              <Button className="mt-30" as={Link} to={`/offerings/${offering.offeringSlug}`} primary fluid content="View" />
                            </Card.Content>
                          </div>
                          <Card.Content extra className={!get(offering, 'isAvailablePublicly') ? 'disabled' : ''}>
                            {showInvestorsCount(offering) && <p><b>{isFunded ? 'Raised' : 'Already raised'} {Helper.CurrencyFormat(get(offering, 'closureSummary.totalInvestmentAmount') || 0, 0)} {get(offering, 'keyTerms.securities') !== 'FUNDS' ? `from ${get(offering, 'closureSummary.totalInvestorCount') || 0} investors` : ''}</b></p>}
                            {isFunded
                              && (
                                <p><b>Funded in {DataFormatter.getDateAsPerTimeZone(get(offering, 'closureSummary.hardCloseDate'), true, false, false, 'MMMM YYYY')}</b></p>
                              )
                            }
                            <p className="more-info">
                              Offered by {offering && offering.regulation
                                ? CAMPAIGN_OFFERED_BY[offering.regulation]
                                : CAMPAIGN_OFFERED_BY[offering.keyTerms.regulation]}
                            </p>
                          </Card.Content>
                          {offering.stage === 'LOCK' && (
                            <Card.Content className="card-hidden">
                              <div className="lock-image">
                                <NSImage mini path="icon_lock.png" />
                              </div>
                              <div className="details">
                                <div className="tags mb-10 text-uppercase intro-text">
                                  <b>hidden</b>
                                </div>
                                <Card.Header>For NextSeed members only.</Card.Header>
                                <Card.Meta>
                                  Login or complete your profile to view this offering.
                              </Card.Meta>
                              </div>
                            </Card.Content>
                          )
                          }
                        </Card>
                      </Grid.Column>
                    ))}
                  </Grid>
                ) : <InlineLoader text="No data found." />
            }
            {this.props.loadMoreButton}
          </Container>
          {this.state.filters && <div className="overlay" />}
        </section>
      </>
    );
  }
}
