import React, { Component } from 'react';
import { Header, Grid, Card, Divider, Button, Item, Accordion, Icon } from 'semantic-ui-react';
import Banklogo from '../../../assets/images/boa-logo.jpg';

export default class BankAccount extends Component {
  render() {
    return (
      <div>
        <Header as="h3">Bank Account</Header>
        <p className="intro-text">Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris<br />
          nec malesuada fames ac turpis
        </p>
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}>
              <Card fluid>
                <Card.Content>
                  <Header as="h3">You haven’t linked bank account yet</Header>
                  <p>Link your bank account to be able to invest in offerings.</p>
                  <Divider hidden />
                  <Card.Description>
                    <Button primary content="Link bank account" />
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <Card fluid className="linked-bank">
                <Card.Content>
                  <Grid columns="equal">
                    <Grid.Row>
                      <Grid.Column verticalAlign="middle">
                        <Item>
                          <Item.Image size="small" src={Banklogo} />
                        </Item>
                      </Grid.Column>
                      <Grid.Column>
                        <Item>
                          <Item.Content>
                            <Item.Extra>Number</Item.Extra>
                            <Item.Header>...5043</Item.Header>
                          </Item.Content>
                        </Item>
                      </Grid.Column>
                      <Grid.Column>
                        <Item>
                          <Item.Content>
                            <Item.Extra>Date linked</Item.Extra>
                            <Item.Header>3/20/18</Item.Header>
                          </Item.Content>
                        </Item>
                      </Grid.Column>
                      <Grid.Column>
                        <Item>
                          <Item.Content>
                            <Item.Extra>Status</Item.Extra>
                            <Item.Header>Active</Item.Header>
                          </Item.Content>
                        </Item>
                      </Grid.Column>
                      <Grid.Column width={5} textAlign="right" verticalAlign="middle">
                        <Button inverted color="green" content="Change Linked Bank" />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              <Card fluid>
                <Card.Content>
                  <Header as="h3">Bank Account FAQs</Header>
                  <Accordion>
                    <Accordion.Title active>
                      <Icon name="dropdown" />
                      Lorem ipsum dolor sit amet enim ullamcorper?
                    </Accordion.Title>
                    <Accordion.Content active>
                      <p>
                        Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum
                        dapibus, mauris nec malesuada fames ac turpis Pellentesque facilisis.
                        Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec
                        malesuada fames ac turpis
                      </p>
                    </Accordion.Content>
                  </Accordion>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
