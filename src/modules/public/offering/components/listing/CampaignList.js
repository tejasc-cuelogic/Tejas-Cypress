/* eslint-disable import/no-dynamic-require, global-require */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Container, Card, Image, Button, Label, Icon, List } from 'semantic-ui-react';
import Filters from './Filters';
import lockIcon from '../../../../../assets/images/icon_lock.png';

const campaigns = [
  {
    id: 1,
    label: '300% Funded',
    title: 'Buffbrew Taproom',
    address: 'Houston, TX',
    description: `Houston Brewery is expanding its facilities and launching the new Taproom,
    complete with a full-service kitchen, event space and over 40 beers on tap.`,
    category: { name: 'brewpub', details: '1.45x/48mos' },
  },
  {
    id: 2,
    label: 'New',
    title: 'Mob Cycle',
    address: 'Salt Lake City, UT',
    description: `Experienced team opening one of the first indoor cycling studios
    in downtown Salt Lake City. Skilled instructors and top of the line equipment.
    Looking to expand throughout the state and region.`,
    category: { name: 'fitness', details: '1.45x/48mos' },
  },
  {
    id: 3,
    label: '10 days left',
    title: 'Avant Media Institute',
    address: 'Houston, TX',
    description: `Audio engineering program providing relevant, hands-on
    training with experienced faculty. Seeking national accreditation.`,
    category: { name: 'education', details: '11%/18mos' },
  },
];

export default class CampaignList extends Component {
  state = { filters: false };
  toggleFilters = status => this.setState({ filters: status });
  render() {
    return (
      <Aux>
        {this.props.filters &&
          <Filters toggle={this.toggleFilters} status={this.state.filters} />
        }
        <section className="campaign-list-wrapper">
          <Container>
            {this.props.heading}
            <Card.Group itemsPerRow={3} stackable>
              {campaigns.map(campaign => (
                <Card className="campaign">
                  <Image
                    as={Link}
                    to={`/offerings/${campaign.id}/overview`}
                    centered
                    src={require(`../../../../../assets/images/campaign/campaign-${campaign.id}.jpg`)}
                  />
                  <Label basic color="green">{campaign.label}</Label>
                  <Icon name="heart" />
                  <Card.Content>
                    <div className="tags">
                      {campaign.category.name}
                      <span className="pull-right">{campaign.category.details}</span>
                    </div>
                    <Card.Header>{campaign.title}</Card.Header>
                    <Card.Meta>{campaign.address}</Card.Meta>
                    <Card.Description>{campaign.description}</Card.Description>
                    <List divided horizontal>
                      <List.Item as={Link} to="/">{campaign.category.name}</List.Item>
                      <List.Item as={Link} to="/">Shedule A</List.Item>
                      <List.Item as={Link} to="/">Revenue Sharing</List.Item>
                    </List>
                  </Card.Content>
                  {this.props.locked === campaign.id && (
                    <Card.Content className="card-hidden">
                      <div className="lock-image">
                        <Image src={lockIcon} />
                      </div>
                      <div className="details">
                        <div className="tags">
                          hidden
                        </div>
                        <Card.Header>For NextSeed members only.</Card.Header>
                        <Card.Meta>Login or complete your profile to view this offering.</Card.Meta>
                      </div>
                    </Card.Content>
                  )
                  }
                </Card>
              ))}
            </Card.Group>
            {this.props.explore && (
              <div className="explore-campaign-button">
                <Button secondary as={Link} to="/offerings/">Explore Campaigns</Button>
              </div>
            )
            }
          </Container>
          {this.state.filters && <div className="overlay" />}
        </section>
      </Aux>
    );
  }
}
