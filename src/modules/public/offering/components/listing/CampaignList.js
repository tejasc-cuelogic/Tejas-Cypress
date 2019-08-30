/* eslint-disable import/no-dynamic-require, global-require */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { capitalize, get } from 'lodash';
import { Container, Card, List, Grid, Message, Label } from 'semantic-ui-react';
// import { IonIcon } from '@ionic/react';
// import { heart } from 'ionicons/icons';
import { InlineLoader, Image64 } from '../../../../../theme/shared';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_REGULATION_ABREVIATION, CAMPAIGN_OFFERED_BY } from '../../../../../constants/offering';
import Helper from '../../../../../helper/utility';
import NSImage from '../../../../shared/NSImage';
import HtmlEditor from '../../../../shared/HtmlEditor';


@inject('campaignStore', 'accreditationStore')
@observer
export default class CampaignList extends Component {
  state = { filters: false };

  componentWillMount() {
    this.props.accreditationStore.resetUserAccreditatedStatus();
  }

  componentWillUnmount() {
    this.props.campaignStore.resetDisplayCounts();
  }

  toggleFilters = () => {
    const { filters } = this.state;
    this.setState({ filters: filters === false });
  }

  renderBaners = (offering) => {
    const resultFound = get(offering, 'isBannerShow');
    if (resultFound) {
      const bannerFirst = get(offering, 'bannerFirstText');
      const bannerSecond = get(offering, 'bannerSecondText');
      return (
        <Label.Group size="small">
          {bannerFirst
          && <Label color="blue">{bannerFirst}</Label>
          }
          {bannerSecond
          && <Label color="green">{bannerSecond}</Label>
          }
        </Label.Group>
      );
    }
    return null;
  }

  render() {
    const { campaigns, loading } = this.props;
    return (
      <>
        {/* {this.props.filters &&
          <Filters toggleFilters={this.toggleFilters} status={this.state.filters} />
        } */}
        <section className="campaign-list-wrapper">
          <Container>
            {this.props.heading}
            {loading ? <InlineLoader />
              : campaigns && campaigns.length
                ? (
<Grid doubling columns={3} stackable>
                  {campaigns.map(offering => (
                    <Grid.Column key={offering.id} data-cy={offering.id}>
                      <Card className="campaign" fluid as={Link} to={`/offerings/${offering.offeringSlug}`}>
                        <div className="campaign-image-wrap">
                          <div className="campaign-card-image">
                            <Image64
                              bg
                              centered
                              srcUrl={offering && offering.media && offering.media.tombstoneImage
                                && offering.media.tombstoneImage.url
                                ? offering.media.tombstoneImage.url : null
                              }
                              alt={`${offering.keyTerms.shorthandBusinessName} poster`}
                            />
                          </div>
                        </div>
                        {offering.stage === 'LIVE' ? this.renderBaners(offering) : null }
                        {/* <IonIcon size="large" icon={heart} /> */}
                        <>
                          <Card.Content>
                            <div className="tags mb-10">
                              {offering && offering.keyTerms && offering.keyTerms.industry ? capitalize(offering.keyTerms.industry.split('_').join(' ')) : '-'}
                              <span className="pull-right">
                                {offering && offering.keyTerms && offering.keyTerms.regulation ? CAMPAIGN_REGULATION_ABREVIATION[offering.keyTerms.regulation] : '-'}
                              </span>
                            </div>
                            <Card.Header>{offering && offering.keyTerms
                              && offering.keyTerms.shorthandBusinessName ? offering.keyTerms.shorthandBusinessName : ''
                            }
                            </Card.Header>
                            <Card.Meta>
                              {offering && offering.keyTerms && offering.keyTerms.city
                                ? offering.keyTerms.city : '-'
                              },{' '}
                              {offering && offering.keyTerms && offering.keyTerms.state
                                ? offering.keyTerms.state : '-'
                              }
                            </Card.Meta>
                            <Card.Description>
                              <HtmlEditor
                                readOnly
                                content={(offering && offering.offering
                                  && offering.offering.overview
                                  && offering.offering.overview.tombstoneDescription
                                  ? offering.offering.overview.tombstoneDescription : '')}
                              />
                            </Card.Description>
                          </Card.Content>
                          <Card.Content extra>
                            <p><b>{offering && offering.keyTerms && offering.keyTerms.securities ? CAMPAIGN_KEYTERMS_SECURITIES[offering.keyTerms.securities] : '-'}</b></p>
                            <List divided horizontal>
                              <List.Item>
                                Raised {Helper.CurrencyFormat((get(offering, 'closureSummary.totalInvestmentAmount') || 0), 0)}
                              </List.Item>
                              <List.Item>
                                {get(offering, 'closureSummary.totalInvestorCount') || 0} investors
                              </List.Item>
                            </List>
                          </Card.Content>
                          <Message attached="bottom" color="teal">
                            Offered by {offering && offering.regulation
                            ? CAMPAIGN_OFFERED_BY[offering.regulation]
                            : CAMPAIGN_OFFERED_BY[offering.keyTerms.regulation]}
                          </Message>
                        </>
                        {offering.stage === 'LOCK' && (
                          <Card.Content className="card-hidden">
                            <div className="lock-image">
                              <NSImage mini path="icon_lock.png" />
                            </div>
                            <div className="details">
                              <div className="tags mb-10">
                                hidden
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
          </Container>
          {this.state.filters && <div className="overlay" />}
        </section>
      </>
    );
  }
}
