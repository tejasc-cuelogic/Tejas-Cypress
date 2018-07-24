import React from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Header, Grid, Button, Container, List, Divider, Segment, Image } from 'semantic-ui-react';
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
        <Segment attached="bottom" padded>
          <Grid doubling columns={2} relaxed="very" className="flex-column">
            <Grid.Column>
              <div className="flex-content">
                <Image src={InvestorImg} />
                <Header as="h3">Term Notes</Header>
                <div className="mb-10">
                  <Header as="h5" attached="top">
                    What are the benefits?
                  </Header>
                  <Segment attached>
                  The business agrees to pay you a set amount of interest on your investment.
                  Payments are fixed each month for a certain number of months.
                  </Segment>
                </div>
                <div className="mb-20">
                  <Header as="h5" attached="top">
                    Who is this option best for?
                  </Header>
                  <Segment attached>
                  This is great for investors seeking consistent, predictable payments.
                  </Segment>
                </div>
              </div>
              <List horizontal>
                <List.Item>
                  <List.Header>Learn more</List.Header>
                  <List.Icon name="arrow right" color="green" />
                  <List.Content as="a">
                  See an example of a Term Note investment
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column>
              <div className="flex-content">
                <Image src={InvestorImg1} />
                <Header as="h3">Revenue Sharing Notes</Header>
                <div className="mb-10">
                  <Header as="h5" attached="top">
                    What are the benefits?
                  </Header>
                  <Segment attached>
                  With revenue sharing loans, a business agrees to pay you a set total amount
                  on top of your investment. Monthly payments may be different every month.
                  </Segment>
                </div>
                <div className="mb-20">
                  <Header as="h5" attached="top">
                    Who is this option best for?
                  </Header>
                  <Segment attached>
                  This is ideal for investors who are looking to grow with a new business concept,
                  accepting payments that may fluctuate but have a higher potential upside.
                  </Segment>
                </div>
              </div>
              <List horizontal>
                <List.Item>
                  <List.Header>Learn more</List.Header>
                  <List.Icon name="arrow right" color="green" />
                  <List.Content as="a">
                  See an example of a Revenue Sharing investment
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid>
        </Segment>
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
            <List horizontal className="mb-50 why-nextseed-learnmore">
              <List.Item>
                <List.Header>Learn more</List.Header>
                <List.Icon name="arrow right" color="green" />
                <List.Content as="a">
                Is investing on NextSeed risky?
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name="arrow right" color="green" />
                <List.Content as="a">
                Are bonus rewards covered by my investment agreements?
                </List.Content>
              </List.Item>
            </List>
          </Grid.Column>
        </Grid>
      </Container>
    </section>
    <Divider fitted as={Container} />
    <div className="mb-50">
      <Container>
        <div className="center-align mt-50 investor-bottom-buttons">
          <Header textAlign="center" as="h2" className="mb-30">
          Register for an account with just your email.
          </Header>
          <Button as={Link} to="/auth/register" secondary>Sign Up Free</Button>
          <Button as={Link} to="/invest/account-types" primary>See Account Types</Button>
        </div>
      </Container>
    </div>
  </Aux>
);

export default HowItWorks;
