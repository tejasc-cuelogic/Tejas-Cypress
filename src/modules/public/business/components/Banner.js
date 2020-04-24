import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Container, Button, Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import NSImage from '../../../shared/NSImage';

@inject('offeringsStore', 'authStore', 'userStore', 'uiStore')
@withRouter
@observer
class Banner extends Component {
  constructor(props) {
    super(props);
    props.offeringsStore.getTotalAmount();
  }

  redirectTo = (action = '') => {
    if (this.props.authStore.isUserLoggedIn && !this.props.userStore.isIssuer) {
      this.props.history.push(`${this.props.match.url}/confirm-login`);
      return;
    }
    if (action === 'business') {
      this.props.history.push('/business-application/business');
    } else if (action === 'cre') {
      this.props.history.push('/business-application/commercial-real-estate');
    }
  }

  render() {
    const { responsiveVars } = this.props.uiStore;
    const { userStore } = this.props;
    return (
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Container>
            <Grid reversed="mobile">
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="left" verticalAlign="middle">
                <Header as="h2">Tap into capital from <br /> your community</Header>
                {!userStore.isIssuer && !responsiveVars.isMobile
                  && (
                    <Button className="mt-40" onClick={this.props.handleApplyCta} primary>Apply Online</Button>
                  )
                }
              </Grid.Column>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 8} floated="right">
                <NSImage path={responsiveVars.isMobile ? 'banners/business-slider-mobile.png' : 'banners/business-slider.png'} fluid />
                {!userStore.isIssuer && responsiveVars.isMobile
                  && (
                    <Button className="mt-40" onClick={this.props.handleApplyCta} primary fluid>Apply Online</Button>
                  )
                }
              </Grid.Column>
            </Grid>
          </Container>
        </section>
    );
  }
}

export default Banner;
