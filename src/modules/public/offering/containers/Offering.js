import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Container, Menu, Image, Card, Label, Icon } from 'semantic-ui-react';
import CardImage from '../../../../assets/images/img.png';

class Offering extends Component {
  render() {
    return (
      <Aux>
        <Container fluid className="mission-banner">
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
                <Image src="../../../../assets/images/icon_filter.png" />
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
            <Card.Group itemsPerRow={3}>
              <Card>
                <Image src={CardImage} />
                <div className="card-labels">
                  <Label>
                    300% funded
                  </Label>
                  <Icon name="heart outline" floated="right" />
                </div>
                <Card.Content>
                  <div className="card-details">
                    <span>brewpub</span>
                    <span className="text-right">.45x/48mos</span>
                  </div>
                  <Card.Header>Buffbrew Taproom</Card.Header>
                  <Card.Meta>
                    <span>Houston, TX</span>
                  </Card.Meta>
                  <Card.Description>
                    Houston Brewery is expanding its facilities and launching the
                    new Buffbrew Taproom, complete with a full-service kitchen, event
                    space and over 40 beers on tap.
                  </Card.Description>
                </Card.Content>
                <Card.Content divided>
                  <a>
                    22 Friends
                  </a>
                  <span> | </span>
                  <a>
                    22 Friends
                  </a>
                  <span> | </span>
                  <a>
                    22 Friends
                  </a>
                </Card.Content>
              </Card>
              <Card>
                <Image src={CardImage} />
                <div className="card-labels">
                  <Label>
                    300% funded
                  </Label>
                  <Icon name="heart" />
                </div>
                <Card.Content>
                  <div>
                    <span floated="left">brewpub</span>
                    <span floated="right">1.45x/48mos</span>
                  </div>
                  <Card.Header>Buffbrew Taproom</Card.Header>
                  <Card.Meta>
                    <span>Houston, TX</span>
                  </Card.Meta>
                  <Card.Description>
                    Houston Brewery is expanding its facilities and launching the
                    new Buffbrew Taproom, complete with a full-service kitchen, event
                    space and over 40 beers on tap.
                  </Card.Description>
                </Card.Content>
                <Card.Content divided>
                  <a>
                    22 Friends
                  </a>
                  <span> | </span>
                  <a>
                    22 Friends
                  </a>
                  <span> | </span>
                  <a>
                    22 Friends
                  </a>
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
