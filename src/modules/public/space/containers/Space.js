import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Responsive, Grid, Divider, Header, Container, List, Icon, Button } from 'semantic-ui-react';
import Banner from '../components/Banner';
import NSImage from '../../../shared/NSImage';

@inject('navStore', 'userStore', 'uiStore')
@observer
class Space extends Component {
  render() {
    const { responsiveVars } = this.props.uiStore;
    const { location } = this.props;
    return (
      <>
        {location.pathname === '/space' ? <Banner />
          : <Responsive as="section" maxWidth={991} className={`banner ${location.pathname.split('/')[2]}`} />
        }
        <Container>
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Grid centered reversed="mobile">
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="left">
                <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-30' : 'mb-50'}>Not your average retail</Header>
                <p>
                  NextSeed Space enables entrepreneurs to test and grow concepts with move-in ready, short-term leases.
                </p>
                <Divider hidden />
                <p>
                  By focusing on what is needed to quickly open and operate their businesses, NextSeed Space allows tenants to immediately thrive while reducing delays, distractions, and other typical retail hurdles.
                </p>
              </Grid.Column>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="right">
                <NSImage path="space/img-1.jpg" className="mb-20" />
                {/* <NSImage path="space/img-1.jpg" /> */}
              </Grid.Column>
            </Grid>
          </section>
          <Divider fitted />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Grid centered reversed="mobile">
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="left">
                <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-30' : 'mb-50'}>For local restaurateurs,<Responsive as="br" minWidth={768} /> makers, and retailers</Header>
                <p>
                  Bring your new or existing concept to our turnkey retail space, with everything needed to open for business.
                </p>
                <Divider hidden />
                <List className="space-list">
                  <List.Item className={responsiveVars.isMobile ? 'mt-0' : 'mb-20'}>
                    <Icon className="ns-tick" color="grey" size="large" />
                    Move-in ready kitchen and storefront
                  </List.Item>
                  <List.Item className={responsiveVars.isMobile ? 'mt-14' : 'mb-20'}>
                    <Icon className="ns-tick" color="grey" size="large" />
                    Permitting and lease negotiations
                  </List.Item>
                  <List.Item className={responsiveVars.isMobile ? 'mt-0' : 'mb-20'}>
                    <Icon className="ns-tick" color="grey" size="large" />
                    The latest point-of-sale technology
                  </List.Item>
                  <List.Item className={responsiveVars.isMobile ? 'mt-14' : 'mb-20'}>
                    <Icon className="ns-tick" color="grey" size="large" />
                    Marketing support to drive business
                  </List.Item>
                </List>
                <Button className="mt-40" secondary>Contact Us</Button>
              </Grid.Column>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="right">
                <p className="quotes left-align">
                  <sup><Icon size="tiny" color="blue" className="ns-quote-left" /></sup> One of the biggest hurdles for a small business is the build-out process. A talented chef or designer might be very skilled at their craft, but many other factors are critical to opening a storefront including the capital raise, lease negotiation, design, permitting, construction and marketing. Finding ways to assist the entrepreneur in reducing complexity and controlling risks at this juncture is critical. <sup><Icon size="tiny" color="blue" className="ns-quote-right" /></sup>
                </p>
              </Grid.Column>
            </Grid>
          </section>
        </Container>
      </>
    );
  }
}

export default Space;
