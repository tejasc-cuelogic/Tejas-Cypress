import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { Card, Grid, Icon, Button, Divider, Table, Label } from 'semantic-ui-react';
import { Image64 } from '../../../../../../theme/shared';
import { CAMPAIGN_OFFERED_BY } from '../../../../../../constants/offering';
import Helper from '../../../../../../helper/utility';
import NSImage from '../../../../../shared/NSImage';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import { DataFormatter } from '../../../../../../helper';

@inject('manageOfferingStore', 'offeringsStore')
@withRouter
@observer
export default class TombstonePreview extends Component {
  uploadMedia = (name) => {
    this.props.manageOfferingStore.uploadMedia(name);
  }

  renderBanner = content => (
    <Label.Group size="small">
      <Label color="grey">{content}</Label>
    </Label.Group>
  );

  render() {
    const { manageOfferingStore, offeringsStore } = this.props;
    const { TOMBSTONE_BASIC_FRM } = manageOfferingStore;
    const { offer } = offeringsStore;
    const isFunded = ['STARTUP_PERIOD', 'IN_REPAYMENT', 'COMPLETE', 'DEFAULTED'].includes(get(offer, 'stage'));
    return (
      <div className="inner-content-spacer">
        <Grid columns="2">
          <Grid.Column>
            <Card className="campaign" fluid to={`/offerings/${offer.offeringSlug}`}>
              <div className="campaign-image-wrap">
                <div className="campaign-card-image">
                  <Image64
                    bg
                    centered
                    srcUrl={TOMBSTONE_BASIC_FRM.fields.image.value || null}
                    alt={`${offer.keyTerms.shorthandBusinessName} poster`}
                  />
                </div>
              </div>
              {TOMBSTONE_BASIC_FRM.fields.customTag.value ? this.renderBanner(TOMBSTONE_BASIC_FRM.fields.customTag.value) : null}
              {(['INVESTOR', 'WATCHING'].includes(offer.watchListStatus))
                && (
                  <Icon name="heart" />
                )
              }
              <div className="campaign-card-details">
                <Card.Content>
                  <Card.Header>{offer && offer.keyTerms
                    && offer.keyTerms.shorthandBusinessName ? offer.keyTerms.shorthandBusinessName : ''
                  }
                  </Card.Header>
                  <Card.Meta>
                    {offer && offer.keyTerms && offer.keyTerms.city
                      ? offer.keyTerms.city : '-'
                    },{' '}
                    {offer && offer.keyTerms && offer.keyTerms.state
                      ? offer.keyTerms.state : '-'
                    }
                  </Card.Meta>
                  <Card.Description>
                    <HtmlEditor
                      readOnly
                      content={(TOMBSTONE_BASIC_FRM.fields.description.value || '')}
                    />
                  </Card.Description>
                  <Divider />
                  <div className="campaign-card-table-wrapper">
                    <Table basic="very" compact="very" unstackable className="no-border campaign-card">
                      <Table.Body>
                        {/* {(isFunded ? keyTermList.filter(i => i.forFunded) : keyTermList).map(row => (
                          <>
                            {((isFunded || row.for.includes('ALL') || row.for.includes(offer.keyTerms.securities)) && ((get(offer, row.key) === 0 || get(offer, row.key)) || row.value))
                              && (
                                <Table.Row verticalAlign="top">
                                  <Table.Cell collapsing>{(row.label === 'Share Price') ? `${capitalize(get(offer, 'keyTerms.equityUnitType'))} Price` : row.label}</Table.Cell>
                                  <Table.Cell className={`${!isFunded && !row.for.includes('ALL') ? 'highlight-text' : ''} right-align`}>
                                    <b>
                                      {((get(offer, row.key) !== undefined && get(offer, row.key) !== null) || row.value)
                                        ? (
                                          <>
                                            {typeof row.type === 'object' ? (
                                              row.type[get(offer, row.key)] || '-'
                                            ) : row.type === '$' ? row.key ? Helper.CurrencyFormat(get(offer, row.key), 0) : row.value
                                                : row.type === '%' ? row.key ? `${get(offer, row.key)}%` : row.value
                                                  : row.type === 'X' ? row.key ? `${get(offer, row.key)}x` : row.value
                                                    : row.type === 'months' ? row.key ? `${get(offer, row.key)} months` : row.value
                                                      : row.type === 'string' ? row.key ? `${get(offer, row.key)}` : row.value
                                                        : row.key ? get(offer, row.key) === 0 ? 0 : (get(offer, row.key) || '') : row.value
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
                        } */}
                      </Table.Body>
                    </Table>
                  </div>
                  <Button className="mt-30" to={`/offerings/${offer.offeringSlug}`} primary fluid content="View" />
                </Card.Content>
              </div>
              <Card.Content extra>
                <p><b>{isFunded ? 'Raised' : 'Already raised'} {Helper.CurrencyFormat(get(offer, 'closureSummary.totalInvestmentAmount') || 0, 0)} from {get(offer, 'closureSummary.totalInvestorCount') || 0} investors</b></p>
                {isFunded
                  && (
                    <p><b>Funded in {DataFormatter.getDateAsPerTimeZone(get(offer, 'closureSummary.hardCloseDate'), true, false, false, 'MMMM YYYY')}</b></p>
                  )
                }
                <p className="more-info">
                  Offered by {offer && offer.regulation
                    ? CAMPAIGN_OFFERED_BY[offer.regulation]
                    : CAMPAIGN_OFFERED_BY[offer.keyTerms.regulation]}
                </p>
              </Card.Content>
              {offer.stage === 'LOCK' && (
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
            <Divider hidden />
          </Grid.Column>
          <Grid.Column>
            <div>Front</div>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
