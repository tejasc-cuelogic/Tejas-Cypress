import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Header, Container, Responsive, Button } from 'semantic-ui-react';

const isTablet = document.documentElement.clientWidth >= 768
&& document.documentElement.clientWidth < 992;

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
    const redirectUrl = isUserLoggedIn ? (isFullInvestor ? '/offerings' : pendingStep) : `auth/${get(stepInRoute, 'to')}`;

    return (
      <section className="banner home-banner">
        <Container>
          <Responsive minWidth={768} as={Aux}>
            <div className="banner-caption">
              <Header as="h2">
            Build an investment<br />portfolio you care about.
              </Header>
              { showButton ?
                <Button
                  className={`${!isTablet && 'mt-30'} relaxed`}
                  primary
                  content="Get Started"
                  as={Link}
                  to={redirectUrl}
                /> : ''
          }
            </div>
          </Responsive>
          <div className="banner-meta">
            <p>
              <b>Ian Tucker | Poitín</b><br />
          Raised $224,700 from 182 investors
            </p>
          </div>
        </Container>
      </section>
    );
  }
}

export default Banner;
