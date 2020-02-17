import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Container, Button, Responsive } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

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
    return (
      <section className="banner home-banner">
        <Container>
          <Responsive minWidth={768} as={React.Fragment}>
            <div className="banner-caption">
              <Header as="h2">
                Accelerate your growth with<br />
                the power of the crowd.
              </Header>
              {!this.props.userStore.isIssuer
              && (
                <Button onClick={this.props.handleApplyCta} primary>Apply Online</Button>
              )
              }
            </div>
          </Responsive>
        </Container>
        <div className="banner-meta">
          <p className="mb-0">Brian Ching | Pitch 25</p>
          <p><b>Raised $549,000 from 392 investors</b></p>
        </div>
      </section>
    );
  }
}

export default Banner;
