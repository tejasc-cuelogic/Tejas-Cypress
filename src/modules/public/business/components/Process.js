import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Grid, Card, Container, Divider, List } from 'semantic-ui-react';

const isMobile = document.documentElement.clientWidth < 768;

const Process = () => (
  <section className="content-spacer">
    <Container>
      <Grid padded="vertically">
        <Grid.Row>
          <Grid.Column floated={isMobile ? '' : 'right'} computer={10} tablet={16} mobile={16} verticalAlign="middle" className="side-section process-right-section">
            <Header as="h2">From approved to funded.</Header>
            <p className="mb-50">
              We give you the platform, tools and support to activate your investors
              and engage your fans.
            </p>
            <Card.Group itemsPerRow={2} stackable className={isMobile ? 'mb-10' : 'mb-30'}>
              <Card>
                <Card.Content>
                  <Header as="h5">Save time with our online application.</Header>
                  <p>
                    Find out quickly if NextSeed is right for your business. Our online
                    application guides you through the process, and we’re here to answer
                    questions along the way.
                  </p>
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Header as="h5">Easily create and launch your campaign.</Header>
                  <p>
                    Our team of deal structuring and content specialists will be there to help
                    at every step. From the content to the paperwork, our team will provide
                    the frameworks and templates to make the process a breeze.
                  </p>
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Header as="h5">Tell your story and amplify your message.</Header>
                  <p>
                    Tap into our marketing, advertising and PR experts. We’ll provide the
                    tools and support you need to raise funds and tap into a base of
                    thousands of local investors.
                  </p>
                  {/* {!isMobile &&
                  <List horizontal relaxed className="learn-more-list mt-80">
                    <List.Item>
                      <List.Header>Learn more</List.Header>
                      <List.Content>
                        How to start a <a href="/">raise on NextSeed</a>
                      </List.Content>
                    </List.Item>
                  </List>
                  } */}
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Header as="h5">Pay and engage investors painlessly.</Header>
                  <p>
                    Our investor management support streamlines your monthly payments,
                    investor updates, reward fulfillment and even annual tax forms.
                  </p>
                </Card.Content>
              </Card>
            </Card.Group>
            {/* {isMobile &&
            <List horizontal relaxed className="learn-more-list">
              <List.Item>
                <List.Header>Learn more</List.Header>
                <List.Content>
                  How to start a <a href="/">raise on NextSeed</a>
                </List.Content>
              </List.Item>
            </List>
            } */}
            <Divider />
            <List className="learn-more-list">
              <List.Item>
                <List.Content as={Link} to="/business/all-inclusive" className="text-uppercase" floated="right">
                  <b>All-Inclusive</b>
                  <List.Icon className="ns-arrow-right" color="green" />
                </List.Content>
              </List.Item>
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </section>
);

export default Process;
