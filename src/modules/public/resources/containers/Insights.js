import React, { Component } from 'react';
import { Container, Image, Menu, Card, Grid, Dropdown } from 'semantic-ui-react';
import Aux from 'react-aux';
import { NsCarousel } from '../../../../theme/shared';
import Insight from '../../../../assets/images/insights2.png';
import InsightCard from '../../../../assets/images/insights-card.png';

export default class Insights extends Component {
  render() {
    const settings = {
      slidesToShow: 3,
      slidesToScroll: 3,
      arrows: true,
    };
    return (
      <Aux>
        <NsCarousel {...settings} className="insight-slider">
          {
            [1, 2, 3, 4, 5].map(i => (
              <Image src={Insight} key={i} />
            ))
          }
        </NsCarousel>
        <Menu secondary className="menu-secondary-fixed insight-menu">
          <Container>
            <Menu.Menu secondary className="menu-secondary">
              <Menu.Item>All</Menu.Item>
              <Menu.Item>Business</Menu.Item>
              <Menu.Item>Investors</Menu.Item>
              <Menu.Item>Community</Menu.Item>
              <Menu.Item>Nextseed Stories</Menu.Item>
              <Menu.Item>Nextseed TX</Menu.Item>
              <Menu.Item>Updates</Menu.Item>
            </Menu.Menu>
            <Menu.Item position="right">
              SORT BY
              <Dropdown item text="NEWEST">
                <Dropdown.Menu>
                  <Dropdown.Item>Electronics</Dropdown.Item>
                  <Dropdown.Item>Automotive</Dropdown.Item>
                  <Dropdown.Item>Home</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </Container>
        </Menu>
        <section>
          <Container>
            <Grid columns={4}>
              <Grid.Column>
                <Card className="campaign insights">
                  <Image
                    centered
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
              <Grid.Column>
                <Card className="campaign insights">
                  <Image
                    centered
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
              <Grid.Column>
                <Card className="campaign insights">
                  <Image
                    centered
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
              <Grid.Column>
                <Card className="campaign insights">
                  <Image
                    centered
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
