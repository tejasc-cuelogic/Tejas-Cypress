import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Container, Button, Responsive } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('offeringsStore')
@observer
class Banner extends Component {
  componentWillMount() {
    this.props.offeringsStore.getTotalAmount();
  }

  render() {
    const { clientWidth } = document.documentElement;
    const isTablet = clientWidth >= 768 && clientWidth < 992;
    return (
      <section className="banner business-banner">
        <Container>
          <Responsive minWidth={768} as={Aux}>
            <div className="banner-caption">
              <Header as="h2">
                Accelerate your<br />
                growth with the<br />
                power of the crowd.
              </Header>
              <Button.Group className={!isTablet && 'mt-30'}>
                <Button secondary content="Business Application" as={Link} to="/business-application/business" />
                <Button secondary content="CRE Application" as={Link} to="/business-application/commercial-real-estate" />
              </Button.Group>
            </div>
          </Responsive>
          <div className="banner-meta">
            <p>
              <b>Jessica Hughes | Citizen Pilates</b><br />Raised $100,00 from 75 investors
            </p>
          </div>
        </Container>
      </section>
    );
  }
}

export default Banner;
