/* eslint-disable import/no-dynamic-require, global-require */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Container, Card, Image, Label, Icon, List, Grid } from 'semantic-ui-react';
import Filters from './Filters';
import { Spinner } from '../../../../../theme/shared';
import lockIcon from '../../../../../assets/images/icon_lock.png';

@inject('campaignStore')
@observer
export default class CampaignList extends Component {
  state = { filters: false };
  componentWillMount() {
    this.props.campaignStore.initRequest();
  }
  toggleFilters = () => {
    const { filters } = this.state;
    this.setState({ filters: filters === false });
  }
  render() {
    const { OfferingList, loading } = this.props.campaignStore;
    return (
      <Aux>
        {this.props.filters &&
          <Filters toggleFilters={this.toggleFilters} status={this.state.filters} />
        }
        <section className="campaign-list-wrapper">
          <Container>
            {this.props.heading}
            <Grid doubling columns={3} stackable>
              <Grid.Row>
                {loading ? <Spinner loaderMessage="loading.." /> : OfferingList.map(offering => (
                  <Grid.Column>
                    <Card className="campaign" fluid>
                      <Image
                        as={Link}
                        to={`/offerings/${offering.id}/overview`}
                        centered
                        src={offering.media.tombstoneImage.url}
                        alt={`${offering.businessGeneralInfo.businessName} poster`}
                      />
                      <Label color="green">NEW</Label> {/* apply attribute basic for successful campaigns */}
                      <Icon name="heart" /> {/* change name to "heart outline" for unliked campaigns */}
                      <Card.Content>
                        <div className="tags mb-10">
                          {offering.keyTerms.industry}
                          <span className="pull-right">506(c)</span>
                        </div>
                        <Card.Header>{offering.businessGeneralInfo.businessName}</Card.Header>
                        <Card.Meta>
                          {offering.businessGeneralInfo.address.city}
                          {offering.businessGeneralInfo.address.state}
                        </Card.Meta>
                        <Card.Description>{offering.offering.about.theCompany}</Card.Description>
                        <p><b>{offering.keyTerms.securities}</b></p>
                        <List divided horizontal>
                          <List.Item>Raised $1,000,000</List.Item>
                          <List.Item>583 investors</List.Item>
                        </List>
                      </Card.Content>
                      {this.props.locked === offering.id && (
                        <Card.Content className="card-hidden">
                          <div className="lock-image">
                            <Image src={lockIcon} />
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
              </Grid.Row>
            </Grid>
          </Container>
          {this.state.filters && <div className="overlay" />}
        </section>
      </Aux>
    );
  }
}
