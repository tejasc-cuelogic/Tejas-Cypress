import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Container, Button, Dimmer, Loader } from 'semantic-ui-react';


@inject('uiStore', 'publicStore')
@withRouter
@observer
class Banner extends Component {
  render() {
    const { showButton, redirectUrl } = this.props.publicStore;
    const { responsiveVars } = this.props.uiStore;
    return (
      <section className="banner business-banner">
        <Container>
          <div className="banner-caption">
            <Header as="h2">
              Expand your portfolio.<br />Invest in small business.
            </Header>
            { showButton
              ? (
                <Button
                  className={`${responsiveVars.isMobile && 'mb-50'} relaxed`}
                  primary
                  content="Get Started"
                  as={Link}
                  to={redirectUrl}
                  fluid={responsiveVars.isMobile}
                />
              ) : ''
            }
          </div>
          <div className="banner-meta">
            <p>
              Bravery Chef Hall<br /><b>Raised $1,000,000 from 539  investors</b>
            </p>
          </div>
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
