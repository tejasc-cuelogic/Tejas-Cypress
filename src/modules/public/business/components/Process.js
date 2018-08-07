import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Grid, Card, List, Button, Container } from 'semantic-ui-react';

const Process = () => (
  <section className="content-spacer process-banner">
    <Container>
      <Grid padded="vertically">
        <Grid.Row>
          <Grid.Column floated="right" width={10} verticalAlign="middle" className="side-section process-right-section">
            <Header as="h2">From approved to funded</Header>
            <p className="mb-50">
            Once your application is approved, we make connecting with investors easy,
            so you can find funding and get back to your business.
            </p>
            <Card.Group itemsPerRow={2} className="mb-30">
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
                    Our team of financial, legal and marketing specialists will be there to
                    help at every step. From the content to the paperwork, our team will
                    provide the frameworks and templates to make the process a breeze.
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
            <List horizontal relaxed className="learn-more-list mb-50">
              <List.Item>
                <List.Header>Learn more</List.Header>
                <List.Icon className="ns-arrow-right" color="green" />
                <List.Content as="a">How to start a raise on NextSeed </List.Content>
              </List.Item>
            </List>
            <div className="center-align">
              <Button as={Link} to="/business/all-inclusive" primary>See All-Inclusive</Button>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </section>
);

export default Process;
