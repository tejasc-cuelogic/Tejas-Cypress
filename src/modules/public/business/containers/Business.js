import React, { Component } from 'react';
import { Header, Container, Button, Menu, Grid, Image, Divider } from 'semantic-ui-react';
import Aux from 'react-aux';
import supportIcon from '../../../../assets/images/support.svg';
import sellingIcon from '../../../../assets/images/selling.svg';
import networkIcon from '../../../../assets/images/network.svg';

class Business extends Component {
  render() {
    return (
      <Aux>
        <Container fluid className="banner business-banner">
          <Container>
            <div className="banner-caption">
              <Header as="h1">
              Accelerate your<br />
              growth with the<br />
              power of the crowd
              </Header>
              <Button secondary>Apply Now</Button>
            </div>
          </Container>
        </Container>
        <Menu secondary className="center-align menu-secondary">
          <Menu.Item name="Fundraising" />
          <Menu.Item name="How it Works" active />
          <Menu.Item name="Funding Options" />
          <Menu.Item name="Process" />
          <Menu.Item name="All-Inclusive" />
          <Menu.Item name="Compare" />
        </Menu>
        <section>
          <Container>
            <Header as="h2" className="mb-80" textAlign="center">
              Get flexible financing that doesn’t<br />cost you everything.
            </Header>
            <Grid relaxed="very" stackable columns={3}>
              <Grid.Column className="info-grid">
                <Image src={sellingIcon} verticalAlign="top" />
                <div>
                  <Header as="h5">New, community-driven approach</Header>
                  <p>
                    Rich uncles and banks aren’t your only funding options.
                    With NextSeed, everyone is now a potential source of capital –
                    and a potential advocate.
                  </p>
                </div>
              </Grid.Column>
              <Grid.Column className="info-grid">
                <Image src={supportIcon} verticalAlign="top" />
                <div>
                  <Header as="h5">Simpler, easier, with support built in</Header>
                  <p>
                    NextSeed streamlines your fundraising, up until your final payment to investors.
                    We’re with you at every step, so you can raise capital without losing sight of
                    your business.
                  </p>
                </div>
              </Grid.Column>
              <Grid.Column className="info-grid">
                <Image src={networkIcon} verticalAlign="top" />
                <div>
                  <Header as="h5">Cost-effective capital, with marketing benefits</Header>
                  <p>
                    With NextSeed, you have access to a unique type of loan that maximizes
                    your ownership stake. Share your concept with thousands of local
                    investors, as well as your fans all over the country.
                  </p>
                </div>
              </Grid.Column>
            </Grid>
            <div className="mt-80 mb-30 center-align">
              <Button secondary content="Apply now" />
            </div>
          </Container>
        </section>
        <Divider fitted as={Container} />
        <section>
          <Grid />
        </section>
        <Divider fitted as={Container} />
      </Aux>
    );
  }
}

export default Business;
