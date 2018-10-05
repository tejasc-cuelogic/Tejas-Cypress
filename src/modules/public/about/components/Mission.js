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
              </p>
              <p>
                Through NextSeed, local entrepreneurs are building places people love, creating
                jobs, and making a tangible impact in their neighborhoods. Investors are getting
                access to private investment opportunities once reserved for the wealthy, and
                connecting with the businesses that matter most to them.
              </p>
            </Grid.Column>
            <Grid.Column width={8}>
              <p>
                The team behind NextSeed created the first registered funding portal with the
                Securities & Exchange Commission (SEC) and became a member of the Financial
                Industry Regulatory Authority (FINRA). The portal closed the first-ever
                regulation crowdfunding offering in the country. Beginning in October 2018,
                NextSeed Securities LLC operates as an SEC-registered broker-dealer and FINRA
                member.
              </p>
              <p>
                Anyone in the US, regardless of income or net worth, can now invest in innovative
                local business concepts that are defining the new landscape of Main Street.
                Everyday people have an opportunity to start building a portfolio of impactful,
                local and community-driven investments.
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
                        <Statistic.Value>290</Statistic.Value>
                        <Statistic.Label>Jobs created <sup>5</sup></Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                  </Grid>
                </Grid.Row>
                <Grid.Row>
                  <Grid divided className="secondary-statistic">
                    <Grid.Column width={8} textAlign="center">
                      <Statistic size={isMobile ? 'mini' : 'tiny'} className="basic">
                        <Statistic.Value className="primary-text">70%</Statistic.Value>
                        <Statistic.Label>Food & Beverage</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column width={8} textAlign="center">
                      <Statistic size={isMobile ? 'mini' : 'tiny'} className="basic">
                        <Statistic.Value className="primary-text">7%</Statistic.Value>
                        <Statistic.Label>Hospitality</Statistic.Label>
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
                        <Statistic.Value>$17,819,390</Statistic.Value>
                        <Statistic.Label>
                          Economic impact of businesses funded <sup>6</sup>
                        </Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                  </Grid>
                </Grid.Row>
                <Grid.Row>
                  <Grid divided className="secondary-statistic">
                    <Grid.Column width={8} textAlign="center">
                      <Statistic size={isMobile ? 'mini' : 'tiny'} className="basic">
                        <Statistic.Value className="secondary-text">10%</Statistic.Value>
                        <Statistic.Label>Wellness & Fitness</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column width={8} textAlign="center">
                      <Statistic size={isMobile ? 'mini' : 'tiny'} className="basic">
                        <Statistic.Value className="secondary-text">13%</Statistic.Value>
                        <Statistic.Label>Other</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                  </Grid>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid>
        <p className="note mt-50 center-align">
          <sup>5,6</sup> Based on reported retail impact as reported by the National Retail
          Federation, we derived the average jobs and GDP impact per establishment and
          applied the data to NextSeed deals completed.
        </p>
      </Container>
    </section>
    <section className="statistic-section featured-statistic">
      <Container>
        <Grid celled columns={isMobile ? 1 : 2} className="mb-30">
          <Grid.Row>
            <Grid.Column verticalAlign="middle">
              <Header as="h2">Trust</Header>
              <p>
              Our team of experts vet every offering on our platform, giving people real
              opportunities to invest in the local businesses they believe in.
              </p>
            </Grid.Column>
            <Grid.Column className="blue-block center-align">
              <Statistic size={isMobile ? 'small' : 'large'} className="basic">
                <Statistic.Value>$1.175M</Statistic.Value>
                <Statistic.Label className="mb-30">
                  Total amount paid to investors <sup>7</sup>
                </Statistic.Label>
                <Statistic.Value>40%</Statistic.Value>
                <Statistic.Label>
                  Returning investors who invest in more than one offering <sup>8</sup>
                </Statistic.Label>
              </Statistic>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid celled columns={isMobile ? 1 : 2} className="mb-30">
          <Grid.Row>
            <Grid.Column verticalAlign="middle">
              <Header as="h2">Innovation</Header>
              <p>
              We’re reinventing how local economies can grow from within by offering
              access to new forms of investments and capital.
              </p>
            </Grid.Column>
            <Grid.Column className="primary-block center-align">
              <Statistic size={isMobile ? 'small' : 'large'} className="basic">
                <Statistic.Value>May 2016</Statistic.Value>
                <Statistic.Label className="mb-30">
                  NextSeed US LLC became the first Funding Portal registered by the SEC
                </Statistic.Label>
                <Statistic.Value>October 2018</Statistic.Value>
                <Statistic.Label>
                  NextSeed Securities LLC is licensed and registered with the SEC as a
                   broker-dealer
                </Statistic.Label>
              </Statistic>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid celled columns={isMobile ? 1 : 2} className="mt-50">
          <Grid.Row>
            <Grid.Column verticalAlign="middle">
              <Header as="h2">Community</Header>
              <p>
              We empower entrepreneurs from all walks of life to follow their
              dreams and give back to their communities.
              </p>
            </Grid.Column>
            <Grid.Column className="green-block center-align">
              <Header as="h5" className="center-align">Issuers include:</Header>
              <Statistic size={isMobile ? 'small' : 'large'} className="basic">
                <Statistic.Value>$4.2M</Statistic.Value>
                <Statistic.Label className="mb-30">
                  Invested in women and minority-owned businesses <sup>9</sup>
                </Statistic.Label>
                <Statistic.Value>34%</Statistic.Value>
                <Statistic.Label className="mb-30">
                  Women
                </Statistic.Label>
                <Statistic.Value>50%</Statistic.Value>
                <Statistic.Label>
                  1st or 2nd generation
                </Statistic.Label>
              </Statistic>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <p className="note mt-30 mb-50 center-align">
          The above figures include the total amount raised in offerings completed
          through NextSeed Securities, LLC ($XX,XXX,XXX), NextSeed US, LLC ($XX,XXX,XXX)
          and NextSeed TX, LLC ($XX,XXX,XXX). Historical figures only. Past performance
          of one business is not a guarantee of future results of another business.
        </p>
      </Container>
    </section>
  </Aux>
);

export default Mission;
