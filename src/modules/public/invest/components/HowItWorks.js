import React from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Header, Grid, Button, Container, List, Divider, Image, Item } from 'semantic-ui-react';
import InvestorImg from '../../../../assets/images/investor-img.png';
import InvestorImg1 from '../../../../assets/images/investor-img-1.png';

const HowItWorks = () => (
  <Aux>
    <section>
      <Container>
        <Header as="h2" className="mb-80" textAlign="center">
        Investing, simplified.
        </Header>
        <div className="how-it-works-steps">
          <Grid stackable centered columns={3}>
            <Grid.Column>
              <Header as="h5">Explore</Header>
              <p>
              Browse approved businesses that have passed our strict screening process.
              </p>
            </Grid.Column>
            <Grid.Column>
              <Header as="h5">Invest</Header>
              <p>
              Set up an investment account for free on NextSeed and invest in businesses directly.
              </p>
            </Grid.Column>
            <Grid.Column>
              <Header as="h5">Invest</Header>
              <p>
              NextSeed collects and processes payments directly into your investment account.
              </p>
            </Grid.Column>
          </Grid>
        </div>
      </Container>
    </section>
    <Divider fitted as={Container} />
    <section>
      <Container>
        <Header textAlign="center" as="h2">
        Choose how you want to invest.
        </Header>
        <p className="center-align">Understand and choose the right opportunities with the right payment terms for you.</p>
        <Grid doubling columns={2} relaxed="very" className="flex-column mt-30">
          <Grid.Column>
            <div className="flex-content">
              <Image src={InvestorImg} />
              <Header as="h3">Term Notes</Header>
              <Item.Group>
                <Item relaxed="very">
                  <Item.Content>
                    <Item.Header as="h5">
                      What are the benefits?
                    </Item.Header>
                    <Item.Description attached>
                    The business agrees to pay you a set amount of interest on your investment.
                    Payments are fixed each month for a certain number of months.
                    </Item.Description>
                  </Item.Content>
                </Item>
                <Item relaxed="very">
                  <Item.Content>
                    <Item.Header as="h5">
                      Who is this option best for?
                    </Item.Header>
                    <Item.Description attached>
                    This is great for investors seeking consistent, predictable payments.
                    </Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>
            </div>
            <List horizontal className="learn-more-list mt-30">
              <List.Item>
                <List.Header>Learn more</List.Header>
                <List.Icon className="ns-arrow-right" color="green" />
                <List.Content as="a">See an example of a Term Note investment</List.Content>
              </List.Item>
            </List>
          </Grid.Column>
          <Grid.Column>
            <div className="flex-content">
              <Image src={InvestorImg1} />
              <Header as="h3">Revenue Sharing Notes</Header>
              <Item.Group>
                <Item relaxed="very">
                  <Item.Content>
                    <Item.Header as="h5">
                    What are the benefits?
                    </Item.Header>
                    <Item.Description>
                    With revenue sharing loans, a business agrees to pay you a set total amount
                    on top of your investment. Monthly payments may be different every month.
                    </Item.Description>
                  </Item.Content>
                </Item>
                <Item relaxed="very">
                  <Item.Content>
                    <Item.Header as="h5">
                    Who is this option best for?
                    </Item.Header>
                    <Item.Description>
                    This is ideal for investors who are looking to grow with a new business concept,
                    accepting payments that may fluctuate but have a higher potential upside.
                    </Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>
            </div>
            <List horizontal className="learn-more-list mt-30">
              <List.Item>
                <List.Header>Learn more</List.Header>
                <List.Icon className="ns-arrow-right" color="green" />
                <List.Content as="a">See an example of a Revenue Sharing investment</List.Content>
              </List.Item>
            </List>
          </Grid.Column>
        </Grid>
      </Container>
    </section>
    <Divider fitted as={Container} />
    <section>
      <Container>
        <Grid relaxed="very" stackable columns={2}>
          <Grid.Column>
            <Header as="h2">
            Every investment comes with risk and opportunity.
            </Header>
            <p>
            Remember, returns and bonus rewards are not guaranteed. Investments can be lost
            entirely. Be sure to do your own due diligence, review all offering documents
            carefully, and never invest more than you can afford to lose. Businesses may fail,
            but those that succeed can make a lasting impact in your city.
            </p>
          </Grid.Column>
          <Grid.Column>
            <List relaxed className="mb-50 learn-more-list">
              <List.Item>
                <List.Header>Learn more</List.Header>
                <List.Icon className="ns-arrow-right" color="green" />
                <List.Content as="a">Is investing on NextSeed risky?</List.Content>
              </List.Item>
              <List.Item>
                <List.Icon className="ns-arrow-right" color="green" />
                <List.Content as="a">Are bonus rewards covered by my investment agreements?</List.Content>
              </List.Item>
            </List>
          </Grid.Column>
        </Grid>
      </Container>
    </section>
    <Divider fitted as={Container} />
    <section>
      <Container className="center-align">
        <Header as="h2" className="mb-30">Register for an account with just your email.</Header>
        <Button as={Link} to="/auth/register" secondary>Sign Up Free</Button>
        <Button as={Link} to="/invest/account-types" primary>See Account Types</Button>
      </Container>
    </section>
  </Aux>
);

export default HowItWorks;
