import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Container, Menu, Image, Card, Label, Icon, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import campaign1 from '../../../../assets/images/campaign-1.jpg';
import campaign2 from '../../../../assets/images/campaign-2.jpg';
import campaign3 from '../../../../assets/images/campaign-3.jpg';
import filterIcon from '../../../../assets/images/icon_filter.png';

class Offering extends Component {
  render() {
    return (
      <Aux>
        <Container fluid className="home-banner">
          <Container>
            <div className="banner-caption">
              <Header as="h1">
                Discover opportunities <br />to invest in growing <br />local businesses.
              </Header>
            </div>
          </Container>
        </Container>
        <div className="filter-menu">
          <Container>
            <Menu text>
              <Menu.Item name="filter">
                <Image src={filterIcon} className="filterIcon" />
                 Filter
              </Menu.Item>
              <Menu.Item
                name="50 Results Found"
                position="right"
              />
            </Menu>
          </Container>
        </div>
        <section className="campaign-list-wrapper">
          <Container>
            <Header as="h4" textAlign="center" caption>Active Campaigns</Header>
            <Card.Group itemsPerRow={3} stackable>
              <Card className="campaign">
                <Image src={campaign1} />
                <Label basic color="green">300% Funded</Label>
                <Icon name="heart" />
                <Card.Content>
                  <div className="tags">
                    brewpub
                    <span className="pull-right">1.45x/48mos</span>
                  </div>
                  <Card.Header>Buffbrew Taproom</Card.Header>
                  <Card.Meta>Houston, TX</Card.Meta>
                  <Card.Description>
                    Houston Brewery is expanding its facilities and launching
                    the new Buffbrew Taproom, complete with a full-service
                    kitchen, event space and over 40 beers on tap.
                  </Card.Description>
                  <List divided horizontal>
                    <List.Item as={Link} to="/">Brewery & Pub</List.Item>
                    <List.Item as={Link} to="/">Shedule A</List.Item>
                    <List.Item as={Link} to="/">Revenue Sharing </List.Item>
                  </List>
                </Card.Content>
              </Card>
              <Card className="campaign">
                <Image src={campaign2} />
                <Label basic color="green">New</Label>
                <Icon name="heart outline" />
                <Card.Content>
                  <div className="tags">
                    Fitness
                    <span className="pull-right">1.45x/48mos</span>
                  </div>
                  <Card.Header>Mob Cycle</Card.Header>
                  <Card.Meta>Salt Lake City, UT</Card.Meta>
                  <Card.Description>
                    Experienced team opening one of the first indoor cycling studios
                    in downtown Salt Lake City. Skilled instructors and top of the
                    line equipment. Looking to expand throughout the state and region.
                  </Card.Description>
                  <List divided horizontal>
                    <List.Item as={Link} to="/">Fitness</List.Item>
                    <List.Item as={Link} to="/">Shedule A</List.Item>
                    <List.Item as={Link} to="/">Revenue Sharing </List.Item>
                  </List>
                </Card.Content>
              </Card>
              <Card className="campaign">
                <Image src={campaign3} />
                <Label basic color="green">10 days left</Label>
                <Icon name="heart outline" />
                <Card.Content>
                  <div className="tags">
                    Education
                    <span className="pull-right">11%/18mos</span>
                  </div>
                  <Card.Header>Avant Media Institute</Card.Header>
                  <Card.Meta>Houston, TX</Card.Meta>
                  <Card.Description>
                    Audio engineering program providing relevant, hands-on
                    training with experienced faculty. Seeking national accreditation.
                  </Card.Description>
                  <List divided horizontal>
                    <List.Item as={Link} to="/">Education</List.Item>
                    <List.Item as={Link} to="/">Shedule A</List.Item>
                    <List.Item as={Link} to="/">Revenue Sharing </List.Item>
                  </List>
                </Card.Content>
              </Card>
            </Card.Group>
          </Container>
        </section>
      </Aux>
    );
  }
}

export default Offering;
