import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Container, Button } from 'semantic-ui-react';

class Home extends Component {
  render() {
    return (
      <Aux>
        <Container fluid className="home-banner">
          <Container>
            <div className="banner-caption">
              <Header as="h1">
                Raise capital.<br />
                Invest local.<br />
                <span className="highlight-text">Thrive as a<br />
                  community.
                </span>
              </Header>
            </div>
          </Container>
        </Container>
        <section>
          <Container text textAlign="center">
            <Header as="h2">
              A community-driven platform for fundraising and investing.
            </Header>
            <p>
              Welcome to capital investing reinvented. NextSeed connects entrepreneurs with
              everyday people to help businesses, investors and communities grow together.
            </p>
            <Button primary content="Primary Button" />
            <Button secondary content="Secondary Button" />
          </Container>
        </section>
      </Aux>
    );
  }
}

export default Home;
