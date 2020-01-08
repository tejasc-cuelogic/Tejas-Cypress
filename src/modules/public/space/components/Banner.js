import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { Header, Container } from 'semantic-ui-react';
import { Logo } from '../../../../theme/shared';

@inject('uiStore')
class Banner extends Component {
  render() {
    const { responsiveVars } = this.props.uiStore;
    return (
      <>
        <section className="banner space-banner">
          <Container>
            <div className="banner-caption">
              <Logo alt="nextseed.com/space" dataSrc="LogoNss" />
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
