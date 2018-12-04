import React from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Header, Grid, Button, Container, List, Divider, Item, Image } from 'semantic-ui-react';
import { ASSETS_URL } from '../../../../constants/aws';

const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth < 992;
const HowItWorks = () => (
  <Aux>
    <section className="mb-80 mt-80">
      <Container>
        <Header as="h2" className={isMobile ? 'mb-30' : 'mb-80'} textAlign={isMobile ? 'left' : 'center'}>Investing, simplified.</Header>
        <div className="how-it-works-steps">
          <Grid stackable centered columns={3}>
            <Grid.Column>
              <Header as="h5">Explore</Header>
              <p>Browse approved businesses that have passed our strict screening process.</p>
            </Grid.Column>
            <Grid.Column>
              <Header as="h5">Invest</Header>
              <p>
                Set up an investment account for free on NextSeed and invest in businesses directly.
              </p>
            </Grid.Column>
            <Grid.Column>
              <Header as="h5">Receive</Header>
              <p>NextSeed collects and processes payments directly into your investment account.</p>
            </Grid.Column>
          </Grid>
        </div>
      </Container>
    </section>
    <Divider fitted as={Container} />
    <section className="mb-80 mt-80">
      <Container textAlign={isMobile ? 'left' : 'center'}>
        <Header as="h2">Choose how you want to invest.</Header>
        <p className={isMobile ? 'mb-50' : 'mb-80'}>Understand and choose the right opportunities with the right payment terms for you.</p>
        <Grid doubling columns={3} relaxed={!isTablet && 'very'} className="flex-column" textAlign="left">
          <Grid.Column>
            <div className="flex-content">
              <Header as="h3">
                <Image src={`${ASSETS_URL}images/icons/termnotes.svg`} />
                <span>Term Notes</span>
              </Header>
              <Item.Group relaxed="very">
                <Item>
                  <Item.Content>
                    <Header as="h5">How does it work?</Header>
                    <Item.Description attached>
                      The business agrees to pay you a set amount of interest on your investment.
                      Payments are fixed each month for a certain number of months.
                    </Item.Description>
                  </Item.Content>
                </Item>
                <Item>
                  <Item.Content>
                    <Header as="h5">Who is this option best for?</Header>
                    <Item.Description attached>
                      This is great for investors seeking consistent, predictable payments.
                    </Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>
            </div>
            {/* <List verticalAlign="top" horizontal
            className={`learn-more-list ${isMobile ? 'mb-30' : 'mt-30'}`}>
              <List.Item>
                <List.Header>Learn more</List.Header>
                <List.Content>
                  See an example of a <a href="/">Term Note investment</a>
                </List.Content>
              </List.Item>
            </List> */}
          </Grid.Column>
          <Grid.Column>
            <div className="flex-content">
              <Header as="h3">
                <Image src={`${ASSETS_URL}images/icons/applied.svg`} />
                <span>Revenue Sharing Notes</span>
              </Header>
              <Item.Group relaxed="very" className="question-list">
                <Item>
                  <Item.Content>
                    <Header as="h5">How does it work?</Header>
                    <Item.Description>
                      With revenue sharing loans, a business agrees to pay you a set total amount
                      on top of your investment. Monthly payments may be different every month.
                    </Item.Description>
                  </Item.Content>
                </Item>
                <Item>
                  <Item.Content>
                    <Header as="h5">Who is this option best for?</Header>
                    <Item.Description>
                      This is ideal for investors who are looking to grow with a new business
                      concept, accepting payments that may fluctuate but have a higher
                      potential upside.
                    </Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>
            </div>
            {/* <List verticalAlign="top" horizontal
            className={`learn-more-list ${isMobile ? '' : 'mt-30'}`}>
              <List.Item>
                <List.Header>Learn more</List.Header>
                <List.Content>
                  See an example of a <a href="/">Revenue Sharing Note investment</a>
                </List.Content>
              </List.Item>
            </List> */}
          </Grid.Column>
          <Grid.Column>
            <div className="flex-content">
              <Header as="h3">
                <Image src={`${ASSETS_URL}images/icons/equity.svg`} />
                <span>Preferred Equity</span>
              </Header>
              <Item.Group relaxed="very" className="question-list">
                <Item>
                  <Item.Content>
                    <Header as="h5">How does it work?</Header>
                    <Item.Description>
                      Preferred equity holders have an interest directly in the entity and may
                      realize long-term upside on the equity. Payment terms will vary and there
                      is no maturity date, but there may be a higher potential return.
                    </Item.Description>
                  </Item.Content>
                </Item>
                <Item>
                  <Item.Content>
                    <Header as="h5">Who is this option best for?</Header>
                    <Item.Description>
                      Investors who can tolerate greater risk, but who are interested in an
                      equity stake in a project and a potentially higher financial return over
                      a longer period.
                    </Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>
            </div>
          </Grid.Column>
        </Grid>
      </Container>
    </section>
    <section className="bg-offwhite">
      <Container>
        <Grid relaxed={!isTablet && 'very'} stackable centered className="mt-80 mb-80">
          <Grid.Row>
            <Grid.Column width={10} textAlign="center">
              <Header as="h2">Every investment comes with risk and opportunity.</Header>
              <p>
                Remember, returns and bonus rewards are not guaranteed. Investments can be lost
                entirely. Be sure to do your own due diligence, review all offering documents
                carefully, and never invest more than you can afford to lose. Businesses may fail,
                but those that succeed can make a lasting impact in your city.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </section>
    <section className="mt-50">
      <Container className="center-align">
        <Header as="h2" className="mb-30">Register for an account.</Header>
        <Button.Group vertical={isMobile} className="mb-50">
          <Button as={Link} to="/auth/register" secondary>Sign Up Free</Button>
        </Button.Group>
        <Divider section hidden />
        <Divider />
        <List className="learn-more-list">
          <List.Item>
            <List.Content as={Link} to="/invest/account-types" className="text-uppercase" floated="right">
              <b>Account Types</b>
              <List.Icon className="ns-arrow-right" color="green" />
            </List.Content>
          </List.Item>
        </List>
      </Container>
    </section>
  </Aux>
);

export default HowItWorks;
