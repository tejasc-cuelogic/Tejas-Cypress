import React from 'react';
import Aux from 'react-aux';
import { Header, Container, Menu, Grid, Statistic } from 'semantic-ui-react';


const ambassadors = () => (
  <Aux>
    <Container fluid className="mission-banner banner">
      <Container>
        <div className="banner-caption">
          <Header as="h1">
            Everyone thrives when <br />we invest in each other.
          </Header>
        </div>
      </Container>
    </Container>
    <Menu secondary className="center-align menu-secondary">
      <Menu.Item name="About Us" />
      <Menu.Item name="mission" active />
      <Menu.Item name="team" />
      <Menu.Item name="careers" />
      <Menu.Item name="impact" />
      <Menu.Item name="ambassadors" />
      <Menu.Item name="press" />
    </Menu>
    <Container>
      <section>
        <Grid centered stackable>
          <Grid.Row>
            <Grid.Column width={14}>
              <Header as="h2" className="caption" textAlign="center">
                Our mission is to connect businesses and individuals to build vibrant communities.
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={7}>
              <p>
                By using the latest crowdfunding laws and technology, NextSeed is empowering
                business owners and everyday people to invest in one another and grow together.
                Through NextSeed, local entrepreneurs are building places people love, creating
                jobs, and making a tangible impact in their neighborhoods. Investors are getting
                access to private investment opportunities once reserved for the wealthy, and
                connecting with the businesses that matter most to them.
              </p>
            </Grid.Column>
            <Grid.Column width={7}>
              <p>
                NextSeed is the first SEC-registered Funding Portal under the JOBS Act and closed
                the first ever Regulation Crowdfunding offering in July 2016.
              </p>
              <p>
                Anyone in the US, regardless of income or net worth, can now invest in restaurants,
                bars, fitness studios, and other local businesses. Investments start at $100,
                giving everyday people a real opportunity to start building a portfolio of
                local investments.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </section>
    </Container>
    <section className="mission-statistic-section">
      <Container>
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={14}>
              <Header as="h2" className="caption" textAlign="center">Our impact so far.</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid celled="internally" centered stackable>
            <Grid.Row>
              <Grid.Column width={7} className="green-block mission-block" textAlign="center">
                {/* <Header as="h2">$17,819,390</Header>
                <p>Economic impact of businesses funded1</p> */}
                <Statistic size="tiny" className="basic">
                  <Statistic.Value>$17,819,39</Statistic.Value>
                  <Statistic.Label>Economic impact of businesses funded1</Statistic.Label>
                </Statistic>
                <Grid divided className="mission-base-block">
                  <Grid.Column width={8} textAlign="center">
                    {/* <Header as="h3" className="primary-text">14</Header>
                    <p>Cities with NextSeed Issuers</p> */}
                    <Statistic size="tiny" className="basic">
                      <Statistic.Value className="primary-text">14</Statistic.Value>
                      <Statistic.Label>Cities with NextSeed Issuers</Statistic.Label>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column width={8} textAlign="center">
                    {/* <Header as="h3" className="primary-text">290</Header>
                    <p>Jobs created2</p> */}
                    <Statistic size="tiny" className="basic">
                      <Statistic.Value className="primary-text">290</Statistic.Value>
                      <Statistic.Label>Jobs created2</Statistic.Label>
                    </Statistic>
                  </Grid.Column>
                </Grid>
              </Grid.Column>
              <Grid.Column width={7} className="blue-block mission-block" textAlign="center">
                {/* <Header as="h2">$6.3M</Header>
                <p>Total amount raised via debt crowdfunding</p> */}
                <Statistic size="tiny" className="basic">
                  <Statistic.Value>$6.3M</Statistic.Value>
                  <Statistic.Label>Total amount raised via debt crowdfunding</Statistic.Label>
                </Statistic>
                <Grid divided className="mission-base-block">
                  <Grid.Column width={8} textAlign="center">
                    {/* <Header as="h3" className="secondary-text">$217,360</Header>
                    <p>Average closed offering size</p> */}
                    <Statistic size="tiny" className="basic">
                      <Statistic.Value className="secondary-text">$217,360</Statistic.Value>
                      <Statistic.Label>Average closed offering size</Statistic.Label>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column width={8} textAlign="center">
                    {/* <Header as="h3" className="secondary-text">45 Days</Header>
                    <p>Average time to complete offering</p> */}
                    <Statistic size="tiny" className="basic">
                      <Statistic.Value className="secondary-text">45 Days</Statistic.Value>
                      <Statistic.Label>Average time to complete offering</Statistic.Label>
                    </Statistic>
                  </Grid.Column>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid.Row>
            <Grid.Column width={12} textAlign="center">
              <p className="disclaimer-text">
                1,2 Based on reported retail impact as reported by the National Retail Federation,
                we derived the average jobs and GDP impact per establishment and applied the data
                to NextSeed deals completed.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </section>
  </Aux>
);

export default ambassadors;
