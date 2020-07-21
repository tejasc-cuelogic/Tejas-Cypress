import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Container, Button, Grid, Item, Divider, Responsive } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';

const highlights = [
  {
    title: 'Pre-vetted opportunities',
    icon: 'icons/compass.svg',
    meta: (
      <>
      Only the top 3% of businesses meet our
    proprietary financial criteria.<sup>1</sup>
      </>),
  },
  {
    title: 'Businesses you understand',
    icon: 'icons/checked.svg',
    meta: `Investments in growing businesses across industries. Access the right
      ones for you.`,
  },
  {
    title: 'Flexible amounts',
    icon: 'icons/graph.svg',
    meta: 'Never invest more than you can risk. Investments may start as low as $100.',
  },
  {
    title: 'Exclusive deals',
    icon: 'icons/deals.svg',
    meta: `Opportunities that were once privately reserved for wealthy
    and well-connected investors.`,
  },
  {
    title: 'Impactful investments',
    icon: 'icons/heart.svg',
    meta: `Growing businesses that create jobs and drive growth.
    Create real impact in local communities.`,
  },
  {
    title: 'Returns processed for you',
    icon: 'icons/return.svg',
    meta: `No need to chase payments from business owners. NextSeed facilitates
      any payments from your investments automatically.`,
  },
];

const HowItWorksSummary = ({ covidBanner, isUserLoggedIn, isMobile, uptoTablet }) => (
  <>
  <section>
    <Container className={isMobile ? 'mb-20 mt-20' : 'mt-50 mb-50'} textAlign={isMobile ? 'left' : 'center'}>
      <Header as="h2" className={isMobile ? 'mb-40' : 'mb-60'}>Small business investing, made easy</Header>
      <Grid stackable centered className={!isMobile && 'mt-40'}>
        <Grid.Column width={14}>
          <Item.Group className="horizontal-items home-page">
            {
            highlights.map(h => (
              <Item>
                <div className="ui mini image">
                  <NSImage path={h.icon} />
                </div>
                <Item.Content>
                  <Item.Header as="h6">{h.title}</Item.Header>
                  <Item.Meta>{h.meta}</Item.Meta>
                </Item.Content>
              </Item>
            ))
          }
          </Item.Group>
        </Grid.Column>
      </Grid>
      <div className="center-align mb-50">
        { !isUserLoggedIn
          && <Button fluid={isMobile} className={!isMobile ? 'mt-50' : 'mt-40'} as={Link} to="/register-investor" primary>Create a  Free Account</Button>
        }
      </div>
      <p className={`${isMobile ? '' : 'center-align'} note`}>
        <sup>1</sup>This represents the percent of businesses that began the application
        process, passed NextSeed&apos;s objective diligence criteria, and launched an offering on the platform since NextSeed&apos;s inception.
      </p>
    </Container>
  </section>
  <Divider as={Container} hidden />
  <section>
    {covidBanner}
  </section>
  <Divider as={Container} hidden />
  <section>
    <Container className={isMobile ? 'mb-20 mt-20' : 'mt-50 mb-50'}>
      <Grid>
        <Grid.Row>
          <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16}>
            <Header as="h2" className={uptoTablet ? 'mb-30' : 'mb-40'}>We’ve built an alternative<Responsive minWidth={768} as="br" /> investment platform<Responsive minWidth={768} as="br" /> from the ground up.</Header>
            <p className={`${uptoTablet ? 'mb-14' : 'mb-50'} neutral-text`}>
            Browse highly vetted companies and invest <Responsive minWidth={768} as="br" />
            in just a few clicks, on any device.
            </p>
            {!isUserLoggedIn && !isMobile
              && (
                <Button as={Link} to="/register-investor" primary className="mb-30">Create a  Free Account</Button>
              )
            }
            {isMobile
             && <NSImage path="phones-mockup.png" className="mb-20" />
            }
          </Grid.Column>
          <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16}>
            {!isMobile
             && <NSImage path="phones-mockup.png" className="mb-20" />
            }
            {!isUserLoggedIn && isMobile
              && (
                <Button fluid as={Link} to="/register-investor" primary>Create a  Free Account</Button>
              )
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </section>
  <Divider as={Container} fitted />
  </>
);

export default HowItWorksSummary;
