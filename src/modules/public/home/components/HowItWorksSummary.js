import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Container, Button, Grid, Item, Responsive, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import NSImage from '../../../shared/NSImage';

const highlights = [
  {
    title: 'Pre-vetted opportunities',
    icon: 'icons/prevetted.svg',
    meta: (
      <>
      Only the top 3% of businesses meet our
    proprietary financial criteria.<sup>1</sup>
      </>),
  },
  {
    title: 'Impactful investments',
    icon: 'icons/entrepreneurs.svg',
    meta: `Growing businesses that create jobs and drive growth.
    Create real impact in local communities.`,
  },
  {
    title: 'Exclusive deals',
    icon: 'icons/ventures.svg',
    meta: `Opportunities that were once privately reserved for wealthy
      and well-connected investors.`,
  },
  {
    title: 'Flexible amounts',
    icon: 'icons/investments.svg',
    meta: 'Never invest more than you can risk. Investments may start as low as $100.',
  },
  {
    title: 'Businesses you understand',
    icon: 'icons/businesses.svg',
    meta: `Investments in growing businesses across industries. Access the right
      ones for you.`,
  },
  {
    title: 'Returns processed for you',
    icon: 'icons/returns.svg',
    meta: `No need to chase payments from business owners. NextSeed facilitates
      any payments from your investments automatically.`,
  },
];

const HowItWorksSummary = ({ uiStore, authStore }) => (
  <>
  <section>
    <Container className={uiStore.responsiveVars.isMobile ? 'mb-20 mt-20' : 'mt-50 mb-50'} textAlign={uiStore.responsiveVars.isMobile ? 'left' : 'center'}>
      <Header as="h2" className={uiStore.responsiveVars.isMobile ? 'mb-40' : 'mb-60'}>Small business investing, made easy</Header>
      <Grid stackable centered className={!uiStore.responsiveVars.isMobile && 'mt-40'}>
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
        { !authStore.isUserLoggedIn
          && <Button fluid={uiStore.responsiveVars.isMobile} className={!uiStore.responsiveVars.isMobile ? 'mt-50' : 'mt-40'} as={Link} to="/register-investor" primary>Create a  Free Account</Button>
        }
      </div>
      <p className={`${uiStore.responsiveVars.isMobile ? '' : 'center-align'} note`}>
        <sup>1</sup>This represents the percent of businesses that began the application
        process, passed NextSeed&apos;s objective diligence<Responsive minWidth={992} as="br" /> criteria, and launched an offering on the platform since NextSeed&apos;s inception.
      </p>
    </Container>
  </section>
  <Divider as={Container} fitted />
  <section>
    <Container className={uiStore.responsiveVars.isMobile ? 'mb-20 mt-20' : 'mt-50 mb-50'}>
      <Grid>
        <Grid.Row>
          <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16}>
            <Header as="h2" className={uiStore.responsiveVars.uptoTablet ? 'mb-30' : 'mb-40'}>We’ve built an alternative investment platfrom from the ground up.</Header>
            <p className={uiStore.responsiveVars.uptoTablet ? 'mb-14' : 'mb-50'}>
            Browse highly vetted companies and invest in just a few clicks, on any device.
            </p>
            {!authStore.isUserLoggedIn && !uiStore.responsiveVars.isMobile
              && (
                <Button as={Link} to="/auth/register-investor" primary className="mb-30">Create a  Free Account</Button>
              )
            }
            {uiStore.responsiveVars.isMobile
             && <NSImage path="phones-mockup.png" className="mb-20" />
            }
          </Grid.Column>
          <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16}>
            {!uiStore.responsiveVars.isMobile
             && <NSImage path="phones-mockup.png" className="mb-20" />
            }
            {!authStore.isUserLoggedIn && uiStore.responsiveVars.isMobile
              && (
                <Button fluid as={Link} to="/auth/register-investor" primary>Create a  Free Account</Button>
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

// export default HowItWorksSummary;
export default inject('uiStore', 'authStore')(observer(HowItWorksSummary));
