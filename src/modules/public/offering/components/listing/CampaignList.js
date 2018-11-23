/* eslint-disable import/no-dynamic-require, global-require */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { capitalize } from 'lodash';
import { Container, Card, Image, Label, Icon, List, Grid } from 'semantic-ui-react';
import Filters from './Filters';
import { InlineLoader, Image64 } from '../../../../../theme/shared';
import { ASSETS_URL } from '../../../../../constants/aws';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../constants/offering';

@inject('campaignStore')
@observer
export default class CampaignList extends Component {
  state = { filters: false };
  toggleFilters = () => {
    const { filters } = this.state;
    this.setState({ filters: filters === false });
  }
  render() {
    const { campaigns, loading } = this.props;
    return (
      <Aux>
        {this.props.filters &&
          <Filters toggleFilters={this.toggleFilters} status={this.state.filters} />
        }
        <section className="campaign-list-wrapper">
          <Container>
            {this.props.heading}
            {loading ? <InlineLoader /> :
              campaigns && campaigns.length ?
                <Grid doubling columns={3} stackable>
                  {campaigns.map(offering => (
                    <Grid.Column>
                      <Card className="campaign" fluid as={Link} to={`/offerings/${offering.id}/overview`}>
                        <Image64
                          centered
                          srcUrl={offering && offering.media && offering.media.tombstoneImage &&
                            offering.media.tombstoneImage.url ?
                            offering.media.tombstoneImage.url : null
                          }
                          alt={`${offering.keyTerms.shorthandBusinessName} poster`}
                        />
                        <Label color="green">NEW</Label> {/* apply attribute basic for successful campaigns */}
                        <Icon name="heart" /> {/* change name to "heart outline" for unliked campaigns */}
                        <Card.Content>
                          <div className="tags mb-10">
                            {offering && offering.keyTerms && offering.keyTerms.industry && capitalize(offering.keyTerms.industry.split('_').join(' '))}
                            <span className="pull-right">
                              {offering && offering.keyTerms && offering.keyTerms.securities ? CAMPAIGN_KEYTERMS_SECURITIES[offering.keyTerms.securities] : '-'}
                            </span>
                          </div>
                          <Card.Header>{offering && offering.keyTerms &&
                            offering.keyTerms.shorthandBusinessName ? offering.keyTerms.shorthandBusinessName : ''
                          }
                          </Card.Header>
                          <Card.Meta>
                            {offering && offering.keyTerms && offering.keyTerms.city ?
                              offering.keyTerms.city : '-'
                            }
                            {offering && offering.keyTerms && offering.keyTerms.state ?
                              offering.keyTerms.state : '-'
                            }
                          </Card.Meta>
                          <Card.Description
                            dangerouslySetInnerHTML={{
                              __html: offering && offering.offering &&
                                offering.offering.about && offering.offering.about.theCompany ?
                                offering.offering.about.theCompany : '',
                            }}
                          />
                          <p><b>{offering && offering.keyTerms && offering.keyTerms.securities && capitalize(offering.keyTerms.securities.split('_').join(' '))}</b></p>
                          <List divided horizontal>
                            <List.Item>Raised $1,000,000</List.Item>
                            <List.Item>
                              {(offering && offering.closureSummary &&
                                offering.closureSummary.totalInvestorCount) || 0} investors
                            </List.Item>
                          </List>
                        </Card.Content>
                        {offering.stage === 'LOCK' && (
                          <Card.Content className="card-hidden">
                            <div className="lock-image">
                              <Image src={`${ASSETS_URL}images/icon_lock.png`} />
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
                </Grid> : <InlineLoader text="No data found." />
            }
          </Container>
          {this.state.filters && <div className="overlay" />}
        </section>
      </Aux>
    );
  }
}
