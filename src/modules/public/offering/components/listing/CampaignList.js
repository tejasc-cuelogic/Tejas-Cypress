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

@inject('campaignStore')
@observer
export default class CampaignList extends Component {
  state = { filters: false };
  // componentWillMount() {
  //   this.props.campaignStore.initRequest(this.props.type);
  // }
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
            <Grid doubling columns={3} stackable>
              {campaigns && campaigns.length ?
              campaigns.map(offering => (
                <Grid.Column>
                  <Card className="campaign" fluid as={Link} to={`/offerings/${offering.id}/overview`}>
                    <Image64
                      centered
                      srcUrl={offering && offering.media && offering.media.tombstoneImage &&
                        offering.media.tombstoneImage.url ?
                         offering.media.tombstoneImage.url :
                        `${ASSETS_URL}images/gallery-placeholder.jpg`
                      }
                      alt={`${offering.keyTerms.shorthandBusinessName} poster`}
                    />
                    <Label color="green">NEW</Label> {/* apply attribute basic for successful campaigns */}
                    <Icon name="heart" /> {/* change name to "heart outline" for unliked campaigns */}
                    <Card.Content>
                      <div className="tags mb-10">
                        {offering && offering.keyTerms && capitalize(offering.keyTerms.industry.split('_').join(' '))}
                        <span className="pull-right">506(c)</span>
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
                      <p><b>{offering && offering.keyTerms && capitalize(offering.keyTerms.securities.split('_').join(' '))}</b></p>
                      <List divided horizontal>
                        <List.Item>Raised $1,000,000</List.Item>
                        <List.Item>
                          {(offering && offering.closureSummary &&
                            offering.closureSummary.totalInvestorCount) || 0} investors
                        </List.Item>
                      </List>
                    </Card.Content>
                    {this.props.locked === offering.id && (
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
              )) : <InlineLoader text="No data found." />}
            </Grid>
            }
          </Container>
          {this.state.filters && <div className="overlay" />}
        </section>
      </Aux>
    );
  }
}
