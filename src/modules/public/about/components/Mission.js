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
                Industry Regulatory Authority{' '}
                (<a href="https://www.finra.org/" target="_blank" rel="noopener noreferrer">FINRA</a>).
                {' '}The portal closed the first-ever regulation crowdfunding offering in the country.
                Beginning in October 2018, NextSeed Securities LLC operates as an SEC-registered
                broker-dealer and FINRA member.
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
    <Divider as={Container} />
    <section className="statistic-section featured-statistic">
      <Container>
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={16}>
              <Header as="h2" className="mb-10" textAlign="center">
                We{"'"}ve built our brand and our platform <Responsive minWidth={992} as="br" />on three core values.
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider section as={Container} hidden />
        <Grid celled columns={isMobile ? 1 : 2} className="mb-40">
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
                <Statistic.Value>Top 3%</Statistic.Value>
                <Statistic.Label className="mb-30">
                Business applicants approved and launched campaigns <sup>1</sup>
                </Statistic.Label>
                <Statistic.Value>90%+</Statistic.Value>
                <Statistic.Label>
                Campaigns meet fundraising goals <sup>2</sup>
                </Statistic.Label>
              </Statistic>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid celled columns={isMobile ? 1 : 2} className="mb-40">
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
        <Grid celled columns={isMobile ? 1 : 2}>
          <Grid.Row>
            <Grid.Column verticalAlign="middle">
              <Header as="h2">Community</Header>
              <p>
              We empower entrepreneurs from all walks of life to follow their
              dreams and give back to their communities.
              </p>
            </Grid.Column>
            <Grid.Column className="green-block center-align">
              <Statistic size={isMobile ? 'small' : 'large'} className="basic">
                <Statistic.Value>$8.9 million</Statistic.Value>
                <Statistic.Label className="mb-30">
                  Invested in women and minority-owned businesses <sup>3</sup>
                </Statistic.Label>
                <Statistic.Value>80%</Statistic.Value>
                <Statistic.Label>
                  Issuers are women and minority-owned businesses <sup>4</sup>
                </Statistic.Label>
              </Statistic>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <p className="note mt-30 center-align">
          <sup>1</sup> This calculates the percent of businesses that began the application
          process, passed NextSeed{"'"}s objective diligence <Responsive minWidth={992} as="br" />
          criteria, and launched an offering on the platform since NextSeed{"'"}s inception.
        </p>
        <p className="note center-align">
          <sup>2</sup> Historical figures only. Past performance of one business is not a
          guarantee of future results of another business.
        </p>
        <p className="mb-50 note center-align">
          <sup>3,4</sup> Data reflects figures from both the NextSeed TX and Reg CF
           Platforms as of October 2018.
        </p>
      </Container>
    </section>
  </Aux>
);

export default Mission;
