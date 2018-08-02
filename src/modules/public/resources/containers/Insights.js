import React, { Component } from 'react';
import { Container, Image, Menu, Card, Grid, Dropdown } from 'semantic-ui-react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { NsCarousel } from '../../../../theme/shared';
import Insight from '../../../../assets/images/insights2.png';
import InsightCard from '../../../../assets/images/insights-card.png';

export default class Insights extends Component {
  render() {
    const settings = {
      slidesToShow: 3,
      slidesToScroll: 3,
    };
    return (
      <Aux>
        <NsCarousel {...settings}>
          {
            [1, 2, 3, 4, 5].map(i => (
              <div className="insight-image-wrapper">
                <Image src={Insight} key={i} />
                <div className="image-caption">
                  <p className="news-category">
                  BUSINESS
                  </p>
                  <p className="news-title">
                  Bring the local food movement home with hyper local sourcing.
                  </p>
                </div>
              </div>
            ))
          }
        </NsCarousel>
        <Menu secondary className="menu-secondary-fixed insight-menu">
          <Container>
            <Menu.Menu secondary className="menu-secondary">
              <Menu.Item as={Link} to="/">All</Menu.Item>
              <Menu.Item as={Link} to="/">Business</Menu.Item>
              <Menu.Item as={Link} to="/">Investors</Menu.Item>
              <Menu.Item as={Link} to="/">Community</Menu.Item>
              <Menu.Item as={Link} to="/">Nextseed Stories</Menu.Item>
              <Menu.Item as={Link} to="/">Nextseed TX</Menu.Item>
              <Menu.Item as={Link} to="/">Updates</Menu.Item>
            </Menu.Menu>
            <Menu.Item position="right">
              SORT BY
              <Dropdown item text="NEWEST">
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/">Newest</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/">Oldest</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/">Popular</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </Container>
        </Menu>
        <section>
          <Container>
            <Grid>
              <Grid.Column mobile={16} tablet={8} computer={4} fluid>
                <Card className="campaign insights" as={Link} to="/">
                  <Image
                    src={InsightCard}
                  />
                  <Card.Content>
                    <div className="tags">
                      business
                      <span className="pull-right">2 Min read</span>
                    </div>
                    <Card.Description>
                      Seven Cool Neighborhoods to Consider for Your Next Business
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4} fluid>
                <Card className="campaign insights" as={Link} to="/">
                  <Image
                    src={InsightCard}
                  />
                  <Card.Content>
                    <div className="tags">
                      business
                      <span className="pull-right">2 Min read</span>
                    </div>
                    <Card.Description>
                      Seven Cool Neighborhoods to Consider for Your Next Business
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4} fluid>
                <Card className="campaign insights" as={Link} to="/">
                  <Image
                    src={InsightCard}
                  />
                  <Card.Content>
                    <div className="tags">
                      business
                      <span className="pull-right">2 Min read</span>
                    </div>
                    <Card.Description>
                      Seven Cool Neighborhoods to Consider for Your Next Business
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4} fluid>
                <Card className="campaign insights" as={Link} to="/">
                  <Image
                    src={InsightCard}
                  />
                  <Card.Content>
                    <div className="tags">
                      business
                      <span className="pull-right">2 Min read</span>
                    </div>
                    <Card.Description>
                      Seven Cool Neighborhoods to Consider for Your Next Business
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid>
          </Container>
        </section>
      </Aux>
    );
  }
}
