import React from 'react';
import Aux from 'react-aux';
import { Header, Container, Grid, Statistic, Responsive, Divider } from 'semantic-ui-react';

const isMobile = document.documentElement.clientWidth < 768;
const Mission = () => (
  <Aux>
    <section>
      <Container>
        <Responsive maxWidth={767} as={Aux}>
          <Header as="h2">Everyone thrives when we invest in each other.</Header>
          <Divider section />
        </Responsive>
        <Grid centered stackable>
          <Grid.Row>
            <Grid.Column textAlign={isMobile ? 'left' : 'center'}>
              <Header as="h2">
              Our mission is to connect businesses and <Responsive minWidth={992} as="br" />
              individuals to build vibrant communities.
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <p>
                By using the latest crowdfunding laws and technology, NextSeed is empowering
                business owners and everyday people to invest in one another and grow together.
                Through NextSeed, local entrepreneurs are building places people love, creating
                jobs, and making a tangible impact in their neighborhoods. Investors are getting
                access to private investment opportunities once reserved for the wealthy, and
                connecting with the businesses that matter most to them.
              </p>
            </Grid.Column>
            <Grid.Column width={8}>
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
      </Container>
    </section>
    <section className="statistic-section bg-offwhite">
      <Container>
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={16}>
              <Header as="h2" className="mb-10" textAlign="center">Our impact so far.</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid celled="internally" centered stackable as={Container}>
            <Grid.Row>
              <Grid.Column width={8} textAlign="center">
                <Grid.Row>
                  <Grid className="green-block">
                    <Grid.Column>
                      <Statistic size={isMobile ? 'mini' : 'tiny'} className="basic">
                        <Statistic.Value>$17,819,39</Statistic.Value>
                        <Statistic.Label>Economic impact of businesses funded1</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                  </Grid>
                </Grid.Row>
                <Grid.Row>
                  <Grid divided className="secondary-statistic">
                    <Grid.Column width={8} textAlign="center">
                      <Statistic size={isMobile ? 'mini' : 'tiny'} className="basic">
                        <Statistic.Value className="primary-text">14</Statistic.Value>
                        <Statistic.Label>Cities with NextSeed Issuers</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column width={8} textAlign="center">
                      <Statistic size={isMobile ? 'mini' : 'tiny'} className="basic">
                        <Statistic.Value className="primary-text">290</Statistic.Value>
                        <Statistic.Label>Jobs created</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                  </Grid>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column width={8} textAlign="center">
                <Grid.Row>
                  <Grid className="blue-block">
                    <Grid.Column>
                      <Statistic size={isMobile ? 'mini' : 'tiny'} className="basic">
                        <Statistic.Value>$6.3M</Statistic.Value>
                        <Statistic.Label>Total amount raised via debt crowdfunding</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                  </Grid>
                </Grid.Row>
                <Grid.Row>
                  <Grid divided className="secondary-statistic">
                    <Grid.Column width={8} textAlign="center">
                      <Statistic size={isMobile ? 'mini' : 'tiny'} className="basic">
                        <Statistic.Value className="secondary-text">$217,360</Statistic.Value>
                        <Statistic.Label>Average closed offering size</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column width={8} textAlign="center">
                      <Statistic size={isMobile ? 'mini' : 'tiny'} className="basic">
                        <Statistic.Value className="secondary-text">45 Days</Statistic.Value>
                        <Statistic.Label>Average time to complete offering</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                  </Grid>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid>
        <p className="note mt-50 center-align">
          1,2 Based on reported retail impact as reported by the National Retail Federation,
          we derived the average jobs and GDP impact per establishment and applied the data
          to NextSeed deals completed.
        </p>
      </Container>
    </section>
  </Aux>
);

export default Mission;
