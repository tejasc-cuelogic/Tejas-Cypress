import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { Header, Container } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';

@inject('uiStore')
class Banner extends Component {
  render() {
    const { responsiveVars } = this.props.uiStore;
    return (
      <>
        <section className="banner space-banner">
          <Container>
            <div className="banner-caption">
              <NSImage alt="nextseed.com/space" path="nss-logo.svg" />
              <Header as="h2" className={responsiveVars.isMobile ? 'mt-30' : 'mt-50'}>
                Pop-up retail space for <br />your growing business
              </Header>
            </div>
          </Container>
        </section>
      </>
    );
  }
}

export default Banner;
