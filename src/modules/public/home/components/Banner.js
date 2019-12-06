import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Header, Container, Responsive, Button, Dimmer, Loader } from 'semantic-ui-react';

const { clientWidth } = document.documentElement;
const isTablet = clientWidth >= 768 && clientWidth < 992;

@inject('navStore', 'userDetailsStore', 'authStore', 'userStore')
@observer
class Banner extends Component {
  render() {
    const { isInvestor } = this.props.userStore;
    const { isUserLoggedIn } = this.props.authStore;
    const { signupStatus, pendingStep } = this.props.userDetailsStore;
    const { stepInRoute } = this.props.navStore;
    const showButton = (!isUserLoggedIn || (isUserLoggedIn && isInvestor));
    const isFullInvestor = isInvestor && get(signupStatus, 'activeAccounts') && get(signupStatus, 'activeAccounts').length;
    const redirectUrl = isUserLoggedIn ? (isFullInvestor ? '/offerings' : pendingStep) : `${get(stepInRoute, 'to')}`;

    return (
      <section className="banner business-banner">
        <Container>
          <Responsive minWidth={768} as={React.Fragment}>
            <div className="banner-caption">
              <Header as="h2">
                Build an investment<br />portfolio you care about
              </Header>
              { showButton
                ? (
                  <Button
                    className={`${!isTablet && 'mt-30'} relaxed`}
                    primary
                    content="Get Started"
                    as={Link}
                    to={redirectUrl}
                  />
                ) : ''
              }
            </div>
          </Responsive>
        </Container>
        {this.props.withDimmer && (
          <Dimmer active className="fullscreen">
            <Loader active>Loading..</Loader>
          </Dimmer>
        )}
      </section>
    );
  }
}

export default Banner;
