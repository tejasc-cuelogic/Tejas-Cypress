import React from 'react';
import { Header, Container, Grid, Divider, Statistic } from 'semantic-ui-react';

const isMobile = document.documentElement.clientWidth < 768;
const Impact = () => (
  <>
    <Container>
      <section>
        <Grid centered>
          <Grid.Column computer={8} tablet={16} mobile={16}>
            <Header as="h2" textAlign={isMobile ? 'left' : 'center'}>
            Be a part of something.
            </Header>
            <p className={isMobile ? '' : 'center-align mt-30'}>
            We’re working hard to create something impactful for the people around us.
            It’s what gets us up in the morning. It’s why we’re here.
            </p>
          </Grid.Column>
        </Grid>
      </section>
      <Divider fitted />
      <section className="statistic-section">
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
                        <Statistic.Label>Jobs created</Statistic.Label>
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
                        <Statistic.Label>Economic impact of businesses funded</Statistic.Label>
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
          5,6 Based on reported retail impact as reported by the National Retail Federation,
          we derived the average jobs and GDP impact per establishment and applied the data
          to NextSeed deals completed.
        </p>
      </section>
      <Divider fitted />
      <section className="statistic-section featured-statistic">
        <Grid celled stackable columns={2} className="mb-30">
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
                <Statistic.Label className="mb-50">Total amount paid to investors</Statistic.Label>
                <Statistic.Value>40%</Statistic.Value>
                <Statistic.Label>
                  Returning investors who invest in more than one offering
                </Statistic.Label>
              </Statistic>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid celled stackable columns={2} className="mb-30">
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
                <Statistic.Label className="mb-50">
                NextSeed became the first Funding Portal registered by the SEC
                </Statistic.Label>
                <Statistic.Value>July 2016</Statistic.Value>
                <Statistic.Label>
                NextSeed closed the first-ever Regulation Crowdfunding offering in US history
                </Statistic.Label>
              </Statistic>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid celled stackable columns={2} className="mt-50">
          <Grid.Row>
            <Grid.Column verticalAlign="middle">
              <Header as="h2">Community</Header>
              <p>
              We empower entrepreneurs from all walks of life to follow their
              dreams and give back to their communities.
              </p>
            </Grid.Column>
            <Grid.Column className="green-block center-align">
              <Grid stackable>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <Statistic size="small" className="basic">
                      <Statistic.Value>8,400</Statistic.Value>
                      <Statistic.Label>
                      Registered NextSeed Members
                      </Statistic.Label>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column>
                    <Statistic size="small" className="basic">
                      <Statistic.Value>$4.2M</Statistic.Value>
                      <Statistic.Label>
                      Total capital raised on NextSeed for female and minority-owned businesses
                      </Statistic.Label>
                    </Statistic>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Header as="h5" className="center-align">Issuers include:</Header>
                </Grid.Row>
                <Grid.Row columns={3}>
                  <Grid.Column>
                    <Statistic size="small" className="basic">
                      <Statistic.Value>34%</Statistic.Value>
                      <Statistic.Label>Women</Statistic.Label>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column>
                    <Statistic size="small" className="basic">
                      <Statistic.Value>50%</Statistic.Value>
                      <Statistic.Label>1st or 2nd generation immigrants</Statistic.Label>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column>
                    <Statistic size="small" className="basic">
                      <Statistic.Value>46%</Statistic.Value>
                      <Statistic.Label>Ethnic minorities</Statistic.Label>
                    </Statistic>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <p className="note mt-30 mb-50 center-align">
        7,8,9,10,11,12,13 Data reflects figures from both TX and REG CF Platforms
        as of November 2017.
        </p>
      </section>
    </Container>
  </>
);

export default Impact;
