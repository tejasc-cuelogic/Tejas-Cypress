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
  renderBanner = content => (
    <Label.Group size="small">
      <Label color="grey">{content}</Label>
    </Label.Group>
  );

  render() {
    const { manageOfferingStore, offeringsStore } = this.props;
    const { TOMBSTONE_BASIC_FRM, TOMBSTONE_HEADER_META_FRM } = manageOfferingStore;
    const { offer } = offeringsStore;
    const isFunded = ['STARTUP_PERIOD', 'IN_REPAYMENT', 'COMPLETE', 'DEFAULTED'].includes(get(offer, 'stage'));
    return (
      <div className="inner-content-spacer">
        <Grid centered>
          <Grid.Column width="6">
            <Card className="campaign" fluid to={`/offerings/${offer.offeringSlug}`}>
              <div className="campaign-image-wrap">
                <div className="campaign-card-image">
                  <Image64
                    originalImg
                    reRender
                    bg
                    centered
                    srcUrl={TOMBSTONE_BASIC_FRM.fields.image.preSignedUrl}
                    alt={`${get(offer, 'keyTerms.shorthandBusinessName')} poster`}
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
                        {TOMBSTONE_HEADER_META_FRM.fields.meta.map(row => (
                          <>
                            {(
                                <Table.Row verticalAlign="top">
                                  <Table.Cell collapsing>{row.keyLabel.value}</Table.Cell>
                                  <Table.Cell className="highlight-text right-align">
                                    <b>{row.keyType.value === 'custom' ? row.keyValue.value : Helper.formatValue(row.keyFormat.value, Helper.enumToText(row.keyValue.value, get(offer, row.keyValue.value)))}</b>
                                  </Table.Cell>
                                </Table.Row>
                              )
                            }
                          </>
                        ))
                        }
                      </Table.Body>
                    </Table>
                  </div>
                  <Button className="mt-30" to={`/offerings/${offer.offeringSlug}`} primary fluid content="View" />
                </Card.Content>
              </div>
              <Card.Content extra>
                {TOMBSTONE_BASIC_FRM.fields.toggleMeta.value.includes('INVESTOR_COUNT')
                && (
                <>
                <p><b>{isFunded ? 'Raised' : 'Already raised'} {Helper.CurrencyFormat(get(offer, 'closureSummary.totalInvestmentAmount') || 0, 0)} from {get(offer, 'closureSummary.totalInvestorCount') || 0} investors</b></p>
                {isFunded
                  && (
                    <p><b>Funded in {DataFormatter.getDateAsPerTimeZone(get(offer, 'closureSummary.hardCloseDate'), true, false, false, 'MMMM YYYY')}</b></p>
                  )
                }
                </>
                )}
                <p className="more-info">
                  Offered by {get(offer, 'regulation')
                    ? CAMPAIGN_OFFERED_BY[get(offer, 'regulation')]
                    : get(offer, 'keyTerms.regulation') && CAMPAIGN_OFFERED_BY[get(offer, 'keyTerms.regulation')]}
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
        </Grid>
      </div>
    );
  }
}
