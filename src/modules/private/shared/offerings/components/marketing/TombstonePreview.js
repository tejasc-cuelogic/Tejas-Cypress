import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get, isEmpty } from 'lodash';
import { Card, Grid, Icon, Button, Divider, Table, Label } from 'semantic-ui-react';
import { Image64 } from '../../../../../../theme/shared';
// import { CAMPAIGN_OFFERED_BY } from '../../../../../../constants/offering';
import Helper from '../../../../../../helper/utility';
import NSImage from '../../../../../shared/NSImage';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import { DataFormatter } from '../../../../../../helper';

@inject('manageOfferingStore', 'offeringsStore')
@withRouter
@observer
export default class TombstonePreview extends Component {
  renderBanner = (content) => {
    const offering = this.props.manageOfferingStore.generateBanner();
    const resultFound = get(offering, 'isBannerShow');
    const realEstateBanner = get(offering, 'realEstateBanner');
    const customTag = content ? (<Label color="grey">{content}</Label>) : null;
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
              {TOMBSTONE_BASIC_FRM.fields.stage.value === 'LIVE' && TOMBSTONE_BASIC_FRM.fields.customTag.value ? this.renderBanner(TOMBSTONE_BASIC_FRM.fields.customTag.value) : null}
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
                  {TOMBSTONE_BASIC_FRM.fields.toggleMeta.value.includes('BUSINESS_LOCATION')
                    && (
                      <Card.Meta>
                        {offer && offer.keyTerms && offer.keyTerms.city
                          ? offer.keyTerms.city : '-'
                        },{' '}
                        {offer && offer.keyTerms && offer.keyTerms.state
                          ? offer.keyTerms.state : '-'
                        }
                      </Card.Meta>
                    )
                  }
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
                                <Table.Cell className={`${row.isHighlight.value ? 'highlight-text' : ''} right-align`}>
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
                      <p><b>{isFunded ? 'Raised' : 'Already raised'} {Helper.CurrencyFormat(TOMBSTONE_BASIC_FRM.fields.raisedAmount.value || 0, 0)} from {TOMBSTONE_BASIC_FRM.fields.investorCount.value || 0} investors</b></p>
                      {isFunded
                        && (
                          <p><b>Funded in {DataFormatter.getDateAsPerTimeZone(get(offer, 'closureSummary.hardCloseDate'), true, false, false, 'MMMM YYYY')}</b></p>
                        )
                      }
                    </>
                  )}
                {
                  TOMBSTONE_BASIC_FRM.fields.showOfferedBy.value && (
                    <p className="more-info">
                      {!isEmpty(TOMBSTONE_BASIC_FRM.fields.offeredBy.value) ? TOMBSTONE_BASIC_FRM.fields.offeredBy.value : 'Offered by NextSeed Securities, LLC'}
                    </p>
                  )
                }
              </Card.Content>
              {TOMBSTONE_BASIC_FRM.fields.stage.value === 'LOCK' && (
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
