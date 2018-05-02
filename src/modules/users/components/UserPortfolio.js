import React from 'react';
import { Header, Card, Grid, Statistic, Popup, Icon, Form, List, Radio, Divider, Table, Accordion, Progress, Button } from 'semantic-ui-react';
import { FormDropDown } from '../../../components/form/FormElements';

/* eslint-disable arrow-body-style */
const options = [
  { key: 'i', text: 'Individual', value: 'individual' },
  { key: 'r', text: 'IRA', value: 'ira' },
  { key: 'e', text: 'Entity', value: 'entity' },
];

// state = { activeIndex: 0 };

// handleClick = (e, titleProps) => {
//   const { index } = titleProps;
//   const { activeIndex } = this.state;
//   const newIndex = activeIndex === index ? -1 : index;

//   this.setState({ activeIndex: newIndex });
// };

const userPortfolio = () => {
  // const { activeIndex } = this.state;
  return (
    <div>
      <div className="content-spacer secondary-section">
        <Header as="h3">All accounts overview</Header>
        <Card fluid>
          <Grid divided stackable padded="horizontally" doubling>
            <Grid.Row>
              <Grid.Column mobile={1} tablet={8} computer={3}>
                <Card.Content>
                  <Statistic size="tiny">
                    <Statistic.Label>
                      Deposits
                      <Popup
                        trigger={<Icon name="ns-help-circle outline" />}
                        content="Your Deposits as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$3,810.00</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
              <Grid.Column mobile={1} tablet={8} computer={3}>
                <Card.Content>
                  <Statistic size="tiny">
                    <Statistic.Label>
                      Withdrawals
                      <Popup
                        trigger={<Icon name="ns-help-circle outline" />}
                        content="Your Withdrawals as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$563.55</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
              <Grid.Column mobile={1} tablet={8} computer={3}>
                <Card.Content>
                  <Statistic size="tiny">
                    <Statistic.Label>
                      Payments
                      <Popup
                        trigger={<Icon name="ns-help-circle outline" />}
                        content="Your Payments as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$643.13</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
              <Grid.Column mobile={1} tablet={8} computer={4}>
                <Card.Content>
                  <Statistic size="tiny">
                    <Statistic.Label>
                      Time-Weighted Return
                      <Popup
                        trigger={<Icon name="ns-help-circle outline" />}
                        content="Your Time-Weighted Return as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$3,443.13</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
              <Grid.Column mobile={1} tablet={8} computer={3}>
                <Card.Content>
                  <Statistic size="tiny">
                    <Statistic.Label>
                      Investment limit
                      <Popup
                        trigger={<Icon name="ns-help-circle outline" />}
                        content="Your Investment limit as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$80,000.00</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card>
      </div>
      <div className="content-spacer">
        <Grid stackable verticalAlign="middle" relaxed="very">
          <Grid.Row>
            <Grid.Column mobile={1} tablet={8} computer={4}>
              <Header as="h3">Account details</Header>
            </Grid.Column>
            <Grid.Column mobile={1} tablet={8} computer={3}>
              <Card>
                <Form className="select-option">
                  <FormDropDown placeholder="Select Account" fluid selection options={options} />
                </Form>
              </Card>
            </Grid.Column>
            <Grid.Column mobile={1} tablet={8} computer={5}>
              <List horizontal divided relaxed="very">
                <List.Item>
                  <List.Content>
                    <List.Header>Bank Name</List.Header>
                    <b>Bank of America</b>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>Card ending</List.Header>
                    <b>...7356</b>
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column mobile={1} tablet={8} computer={4} textAlign="right">
              <Radio toggle label="Frozen" />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider hidden />
        <Card fluid>
          <Grid divided stackable padded="horizontally" doubling>
            <Grid.Row>
              <Grid.Column mobile={1} tablet={8} computer={4}>
                <Card.Content>
                  <Statistic size="tiny">
                    <Statistic.Label>
                      Total Balance
                      <Popup
                        trigger={<Icon name="ns-help-circle outline" />}
                        content="Your Total Balance as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$0.00</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
              <Grid.Column mobile={1} tablet={8} computer={4}>
                <Card.Content>
                  <Statistic size="tiny">
                    <Statistic.Label>
                      Total Deposit
                      <Popup
                        trigger={<Icon name="ns-help-circle outline" />}
                        content="Your Total Deposit as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$0.00</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
              <Grid.Column mobile={1} tablet={8} computer={4}>
                <Card.Content>
                  <Statistic size="tiny">
                    <Statistic.Label>
                      Net Payments
                      <Popup
                        trigger={<Icon name="ns-help-circle outline" />}
                        content="Your Net Payments as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$0.00</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
              <Grid.Column mobile={1} tablet={8} computer={4}>
                <Card.Content>
                  <Statistic size="tiny">
                    <Statistic.Label>
                      TNAR
                      <Popup
                        trigger={<Icon name="ns-help-circle outline" />}
                        content="Your TNAR as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$0.00</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card>
        <Header as="h3">Investments</Header>
        <Accordion fluid styled className="card-style">
          <Accordion.Title active>
            <Icon name="ns-chevron-up" />
            Pending
          </Accordion.Title>
          <Accordion.Content active>
            <div className="table-wrapper">
              <Table className="investment-details">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell>Offering</Table.HeaderCell>
                    <Table.HeaderCell>Location</Table.HeaderCell>
                    <Table.HeaderCell>Investment Type</Table.HeaderCell>
                    <Table.HeaderCell textAlign="right">Invested Amount</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell width={2}>% to goal</Table.HeaderCell>
                    <Table.HeaderCell />
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell collapsing><Icon name="ns-ira" /></Table.Cell>
                    <Table.Cell><Icon name="ns-food" color="grey" /> MUHU Hot Pot</Table.Cell>
                    <Table.Cell>Houston</Table.Cell>
                    <Table.Cell>Term Note</Table.Cell>
                    <Table.Cell textAlign="right">$20,000</Table.Cell>
                    <Table.Cell>Live</Table.Cell>
                    <Table.Cell collapsing><Progress percent={25} size="small" color="violet" label="25%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button size="tiny" color="red" className="ghost-button">Cancel</Button>
                      <Button color="green" className="link-button" icon="ns-replay" />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell collapsing><Icon name="ns-ira" /></Table.Cell>
                    <Table.Cell><Icon name="ns-food" color="grey" /> Intero Ristorante</Table.Cell>
                    <Table.Cell>New York</Table.Cell>
                    <Table.Cell>Term Note</Table.Cell>
                    <Table.Cell textAlign="right">$1,500</Table.Cell>
                    <Table.Cell>Processing</Table.Cell>
                    <Table.Cell collapsing><Progress percent={50} size="small" color="violet" label="50%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button size="tiny" color="red" className="ghost-button">Cancel</Button>
                      <Button color="green" className="link-button" icon="ns-replay" />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell collapsing><Icon name="ns-ira" /></Table.Cell>
                    <Table.Cell><Icon name="ns-food" color="grey" /> The Brewers Table</Table.Cell>
                    <Table.Cell>San Francisco</Table.Cell>
                    <Table.Cell>Rev Share</Table.Cell>
                    <Table.Cell textAlign="right">$12,000</Table.Cell>
                    <Table.Cell>Processing</Table.Cell>
                    <Table.Cell collapsing><Progress percent={5} size="small" color="violet" label="5%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button size="tiny" color="red" className="ghost-button">Cancel</Button>
                      <Button color="green" className="link-button" icon="ns-replay" />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell collapsing><Icon name="ns-ira" /></Table.Cell>
                    <Table.Cell><Icon name="ns-food" color="grey" /> Smiley Transportat</Table.Cell>
                    <Table.Cell>Boston</Table.Cell>
                    <Table.Cell>Term Note</Table.Cell>
                    <Table.Cell textAlign="right">$4,000</Table.Cell>
                    <Table.Cell>Live</Table.Cell>
                    <Table.Cell collapsing><Progress percent={25} size="small" color="violet" label="25%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button size="tiny" color="red" className="ghost-button">Cancel</Button>
                      <Button color="green" className="link-button" icon="ns-replay" />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              { /* <button onClick={this.props.loadMore}>loadMore</button> */ }
            </div>
          </Accordion.Content>
        </Accordion>
        {/* <Card fluid>
        </Card> */}
      </div>
    </div>
  );
};

export default userPortfolio;
