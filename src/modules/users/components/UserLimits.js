import React from 'react';
// import { Link } from 'react-router-dom';
import { Card, Statistic, Popup, Icon, Grid, Header, Form, Input, Button } from 'semantic-ui-react';

const userLimits = () => (
  // <Tab className="tabular-wrap compact" menu={{ fluid: true, vertical: true, tabular: 'left' }}
  // panes={panes} renderActiveOnly={false} />
  <div className="content-spacer">
    <Header as="h3">Regulation Crowdfunding Limits</Header>
    <Grid columns={1} stackable>
      <Grid.Row>
        <Grid.Column width={8}>
          <Card fluid>
            <Grid divided padded="horizontally">
              <Grid.Row>
                <Grid.Column width={6}>
                  <Card.Content>
                    <Statistic size="tiny">
                      <Statistic.Label>
                        Your current investment limit
                        <Popup
                          trigger={<Icon name="ns-help-circle outline" />}
                          content="Your current investment limit as of today"
                          position="top center"
                          className="center-align"
                        />
                      </Statistic.Label>
                      <Statistic.Value>$80,200</Statistic.Value>
                    </Statistic>
                  </Card.Content>
                </Grid.Column>
                <Grid.Column width={10}>
                  <Card.Content>
                    <Form>
                      <Form.Field>
                        {/* eslint-disable jsx-a11y/label-has-for */}
                        <label>Annual income</label>
                        <Input
                          label={{ basic: true, content: '$' }}
                          labelPosition="left"
                          fluid
                          placeholder="Annual income"
                          defaultValue="80,000"
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Net Worth</label>
                        <Input
                          label={{ basic: true, content: '$' }}
                          labelPosition="left"
                          fluid
                          placeholder="Net Worth"
                          defaultValue="50,000"
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>
                          Other Regulation Crowdfunding investments made in prior 12 months
                        </label>
                        <Input
                          label={{ basic: true, content: '$' }}
                          labelPosition="left"
                          fluid
                          placeholder="Other Regulation Crowdfunding investments made in prior 12 months"
                          defaultValue="0"
                        />
                      </Form.Field>
                      <Button inverted disabled color="green">Update financial info</Button>
                    </Form>
                  </Card.Content>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default userLimits;
