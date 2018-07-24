import React from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Header, Grid, Button, Container, List, Item } from 'semantic-ui-react';
import Businesses from '../../../../assets/images/icons/businesses.svg';
import Entrepreneurs from '../../../../assets/images/icons/entrepreneurs.svg';
import Prevetted from '../../../../assets/images/icons/prevetted.svg';
import Investments from '../../../../assets/images/icons/investments.svg';
import Ventures from '../../../../assets/images/icons/ventures.svg';
import Returns from '../../../../assets/images/icons/returns.svg';

const WhyNextseed = () => (
  <Aux>
    <section className="why-nextseed-section">
      <Container>
        <Header as="h2" className="mb-80" textAlign="center">
          Local investing, made easy.
        </Header>
        <Grid relaxed="very" stackable>
          <Grid.Column width={10}>
            <Item.Group className="horizontal-items">
              <Item>
                <Item.Image size="mini" src={Businesses} />
                <Item.Content>
                  <Item.Header>Businesses you understand</Item.Header>
                  <Item.Meta>
                    Investments in Main Street businesses and local properties
                    generating real cash flow.
                  </Item.Meta>
                </Item.Content>
              </Item>
              <Item>
                <Item.Image size="mini" src={Entrepreneurs} />
                <Item.Content>
                  <Item.Header>Impactful investments </Item.Header>
                  <Item.Meta>
                  Local business owners, local jobs and local growth. Create real
                  impact in local communities.
                  </Item.Meta>
                </Item.Content>
              </Item>
              <Item>
                <Item.Image size="mini" src={Prevetted} />
                <Item.Content>
                  <Item.Header>Pre-vetted opportunities </Item.Header>
                  <Item.Meta>
                  Every business must meet our strict financial criteria, plus federal legal
                  and regulatory guidelines.
                  </Item.Meta>
                </Item.Content>
              </Item>
              <Item>
                <Item.Image size="mini" src={Investments} />
                <Item.Content>
                  <Item.Header>Flexible investment amounts</Item.Header>
                  <Item.Meta>
                  Never invest more than you can risk. Investments starting at $100
                  </Item.Meta>
                </Item.Content>
              </Item>
              <Item>
                <Item.Image size="mini" src={Ventures} />
                <Item.Content>
                  <Item.Header>Exclusive investments</Item.Header>
                  <Item.Meta>
                  Uncover opportunities that were once privately reserved for wealthy
                  and well-connected investors.
                  </Item.Meta>
                </Item.Content>
              </Item>
              <Item>
                <Item.Image size="mini" src={Returns} />
                <Item.Content>
                  <Item.Header>Returns processed for you</Item.Header>
                  <Item.Meta>
                  No need to chase payments from business owners. NextSeed verifies and processes
                  payments from your investments automatically.
                  </Item.Meta>
                </Item.Content>
              </Item>
            </Item.Group>
          </Grid.Column>
          <Grid.Column width={6}>
            <List horizontal className="mb-50 why-nextseed-learnmore">
              <List.Item>
                <List.Header>Learn more</List.Header>
                <List.Icon name="arrow right" color="green" />
                <List.Content as="a">
                Why invest on NextSeed?
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name="arrow right" color="green" />
                <List.Content as="a">
                What type of NextSeed account is best for me?
                </List.Content>
              </List.Item>
            </List>
          </Grid.Column>
        </Grid>
        <div className="center-align mt-50 investor-bottom-buttons">
          <Button as={Link} to="/auth/register" secondary>Sign Up Free</Button>
          <Button as={Link} to="/invest/how-it-works" primary>See How it Works</Button>
        </div>
      </Container>
    </section>
  </Aux>
);

export default WhyNextseed;
