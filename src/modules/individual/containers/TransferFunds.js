import React, { Component } from 'react';
import { Header, Grid, Card, Button, Statistic, Popup, Accordion, Icon } from 'semantic-ui-react';

export default class TransferFunds extends Component {
  render() {
    return (
      <div>
        <Header as="h3">Transfer funds</Header>
        <Grid>
          <Grid.Row>
            <Grid.Column widescreen={8} largeScreen={11} computer={13} tablet={16} mobile={16}>
              <Card fluid>
                <Card.Content>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={6}>
                        <Statistic size="tiny">
                          <Statistic.Label>
                            Available cash
                            <Popup
                              trigger={<Icon className="ns-help-circle" />}
                              content="Available cash in your Nextseed Account"
                              position="top center"
                              className="center-align"
                            />
                          </Statistic.Label>
                          <Statistic.Value>$15,405.23</Statistic.Value>
                        </Statistic>
                      </Grid.Column>
                      <Grid.Column width={10} textAlign="right" verticalAlign="middle">
                        <Button primary content="Add funds" />
                        <Button inverted color="green" content="Withdraw funds" />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column widescreen={6} largeScreen={8} computer={10} tablet={13} mobile={16}>
              <Card fluid>
                <Card.Content>
                  <Header as="h3">Transfer Funds FAQs</Header>
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
