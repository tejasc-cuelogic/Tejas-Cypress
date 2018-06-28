import React from 'react';
import Aux from 'react-aux';
import { Header, Card, Grid, Statistic, Popup, Icon, Form, List, Radio, Divider, Table, Accordion, Progress, Button } from 'semantic-ui-react';
// import { FormDropDown } from '../../../../../theme/form';

/* eslint-disable arrow-body-style */
// const options = [
//   { key: 'i', text: 'Individual', value: 'individual' },
//   { key: 'r', text: 'IRA', value: 'ira' },
//   { key: 'e', text: 'Entity', value: 'entity' },
// ];

const Portfolio = () => {
  // const { activeIndex } = this.state;
  return (
    <Aux>
      <div className="content-spacer secondary-section">
        <Header as="h3">All accounts overview</Header>
        <Card fluid>
          <Grid divided stackable padded="horizontally" columns={5} doubling>
            <Grid.Row>
              <Grid.Column>
                <Card.Content>
                  <Statistic size="tiny">
                    <Statistic.Label>
                      Deposits
                      <Popup
                        trigger={<Icon className="ns-help-circle" />}
                        content="Your Deposits as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$3,810.00</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
              <Grid.Column>
                <Card.Content>
                  <Statistic size="tiny">
                    <Statistic.Label>
                      Withdrawals
                      <Popup
                        trigger={<Icon className="ns-help-circle" />}
                        content="Your Withdrawals as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$563.55</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
              <Grid.Column>
                <Card.Content>
                  <Statistic size="tiny">
                    <Statistic.Label>
                      Payments
                      <Popup
                        trigger={<Icon className="ns-help-circle" />}
                        content="Your Payments as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$643.13</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
              <Grid.Column>
                <Card.Content>
                  <Statistic size="tiny">
                    <Statistic.Label>
                      Time-Weighted Return
                      <Popup
                        trigger={<Icon className="ns-help-circle" />}
                        content="Your Time-Weighted Return as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$3,443.13</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
              <Grid.Column>
                <Card.Content>
                  <Statistic size="tiny">
                    <Statistic.Label>
                      Investment limit
                      <Popup
                        trigger={<Icon className="ns-help-circle" />}
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
                  dropdown ...
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
          <Grid divided stackable padded="horizontally" columns={4} doubling>
            <Grid.Row>
              <Grid.Column>
                <Card.Content>
                  <Statistic size="tiny" className="basic">
                    <Statistic.Label>
                      Total Balance
                      <Popup
                        trigger={<Icon className="ns-help-circle" />}
                        content="Your Total Balance as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$0.00</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
              <Grid.Column>
                <Card.Content>
                  <Statistic size="tiny" className="basic">
                    <Statistic.Label>
                      Total Deposit
                      <Popup
                        trigger={<Icon className="ns-help-circle" />}
                        content="Your Total Deposit as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$0.00</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
              <Grid.Column>
                <Card.Content>
                  <Statistic size="tiny" className="basic">
                    <Statistic.Label>
                      Net Payments
                      <Popup
                        trigger={<Icon className="ns-help-circle" />}
                        content="Your Net Payments as of today"
                        position="top center"
                        className="center-align"
                      />
                    </Statistic.Label>
                    <Statistic.Value>$0.00</Statistic.Value>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
              <Grid.Column>
                <Card.Content>
                  <Statistic size="tiny" className="basic">
                    <Statistic.Label>
                      TNAR
                      <Popup
                        trigger={<Icon className="ns-help-circle" />}
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
            <Icon className="ns-chevron-up" />
            Pending
          </Accordion.Title>
          <Accordion.Content active>
            <div className="table-wrapper">
              <Table unstackable singleLine className="investment-details">
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
                    <Table.Cell collapsing><Icon className="ns-individual-line" /></Table.Cell>
                    <Table.Cell><Icon className="ns-food offering-icon" /> MUHU Hot Pot</Table.Cell>
                    <Table.Cell>Houston</Table.Cell>
                    <Table.Cell>Term Note</Table.Cell>
                    <Table.Cell textAlign="right">$20,000</Table.Cell>
                    <Table.Cell>Live</Table.Cell>
                    <Table.Cell collapsing><Progress percent={25} size="small" color="violet" label="25%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button size="tiny" color="red" className="ghost-button">Cancel</Button>
                      <Button color="green" className="link-button" icon={{ className: 'ns-replay' }} />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell collapsing><Icon className="ns-individual-line" /></Table.Cell>
                    <Table.Cell><Icon className="ns-food offering-icon" /> Intero Ristorante</Table.Cell>
                    <Table.Cell>New York</Table.Cell>
                    <Table.Cell>Term Note</Table.Cell>
                    <Table.Cell textAlign="right">$1,500</Table.Cell>
                    <Table.Cell>Processing</Table.Cell>
                    <Table.Cell collapsing><Progress percent={50} size="small" color="violet" label="50%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button size="tiny" color="red" className="ghost-button">Cancel</Button>
                      <Button color="green" className="link-button" icon={{ className: 'ns-replay' }} />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell collapsing><Icon className="ns-individual-line" /></Table.Cell>
                    <Table.Cell><Icon className="ns-food offering-icon" /> The Brewers Table</Table.Cell>
                    <Table.Cell>San Francisco</Table.Cell>
                    <Table.Cell>Rev Share</Table.Cell>
                    <Table.Cell textAlign="right">$12,000</Table.Cell>
                    <Table.Cell>Processing</Table.Cell>
                    <Table.Cell collapsing><Progress percent={5} size="small" color="violet" label="5%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button size="tiny" color="red" className="ghost-button">Cancel</Button>
                      <Button color="green" className="link-button" icon={{ className: 'ns-replay' }} />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell collapsing><Icon className="ns-individual-line" /></Table.Cell>
                    <Table.Cell><Icon className="ns-food offering-icon" /> Smiley Transportat</Table.Cell>
                    <Table.Cell>Boston</Table.Cell>
                    <Table.Cell>Term Note</Table.Cell>
                    <Table.Cell textAlign="right">$4,000</Table.Cell>
                    <Table.Cell>Live</Table.Cell>
                    <Table.Cell collapsing><Progress percent={25} size="small" color="violet" label="25%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button size="tiny" color="red" className="ghost-button">Cancel</Button>
                      <Button color="green" className="link-button" icon={{ className: 'ns-replay' }} />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell colSpan="3">Total:</Table.HeaderCell>
                    <Table.HeaderCell textAlign="right">$33,900</Table.HeaderCell>
                    <Table.HeaderCell colSpan="3" />
                  </Table.Row>
                </Table.Footer>
              </Table>
            </div>
          </Accordion.Content>
        </Accordion>
        <Accordion fluid styled className="card-style">
          <Accordion.Title active>
            <Icon className="ns-chevron-up" />
            Active
          </Accordion.Title>
          <Accordion.Content active>
            <div className="table-wrapper">
              <Table unstackable singleLine className="investment-details">
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
                    <Table.Cell collapsing><Icon className="ns-individual-line" /></Table.Cell>
                    <Table.Cell><Icon className="ns-food offering-icon" /> MUHU Hot Pot</Table.Cell>
                    <Table.Cell>Houston</Table.Cell>
                    <Table.Cell>Term Note</Table.Cell>
                    <Table.Cell textAlign="right">$20,000</Table.Cell>
                    <Table.Cell>Live</Table.Cell>
                    <Table.Cell collapsing><Progress percent={25} size="small" color="violet" label="25%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button color="green" className="link-button" icon={{ className: 'ns-replay' }} />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell collapsing><Icon className="ns-individual-line" /></Table.Cell>
                    <Table.Cell><Icon className="ns-food offering-icon" /> Intero Ristorante</Table.Cell>
                    <Table.Cell>New York</Table.Cell>
                    <Table.Cell>Term Note</Table.Cell>
                    <Table.Cell textAlign="right">$1,500</Table.Cell>
                    <Table.Cell>Processing</Table.Cell>
                    <Table.Cell collapsing><Progress percent={50} size="small" color="violet" label="50%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button color="green" className="link-button" icon={{ className: 'ns-replay' }} />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell collapsing><Icon className="ns-individual-line" /></Table.Cell>
                    <Table.Cell><Icon className="ns-food offering-icon" /> The Brewers Table</Table.Cell>
                    <Table.Cell>San Francisco</Table.Cell>
                    <Table.Cell>Rev Share</Table.Cell>
                    <Table.Cell textAlign="right">$12,000</Table.Cell>
                    <Table.Cell>Processing</Table.Cell>
                    <Table.Cell collapsing><Progress percent={5} size="small" color="violet" label="5%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button color="green" className="link-button" icon={{ className: 'ns-replay' }} />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell collapsing><Icon className="ns-individual-line" /></Table.Cell>
                    <Table.Cell><Icon className="ns-food offering-icon" /> Smiley Transportat</Table.Cell>
                    <Table.Cell>Boston</Table.Cell>
                    <Table.Cell>Term Note</Table.Cell>
                    <Table.Cell textAlign="right">$4,000</Table.Cell>
                    <Table.Cell>Live</Table.Cell>
                    <Table.Cell collapsing><Progress percent={25} size="small" color="violet" label="25%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button color="green" className="link-button" icon={{ className: 'ns-replay' }} />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell colSpan="3">Total:</Table.HeaderCell>
                    <Table.HeaderCell textAlign="right">$33,900</Table.HeaderCell>
                    <Table.HeaderCell colSpan="3" />
                  </Table.Row>
                </Table.Footer>
              </Table>
            </div>
          </Accordion.Content>
        </Accordion>
        <Accordion fluid styled className="card-style">
          <Accordion.Title active>
            <Icon className="ns-chevron-up" />
            Completed
          </Accordion.Title>
          <Accordion.Content active>
            <div className="table-wrapper">
              <Table unstackable singleLine className="investment-details">
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
                    <Table.Cell collapsing><Icon className="ns-individual-line" /></Table.Cell>
                    <Table.Cell><Icon className="ns-food offering-icon" /> MUHU Hot Pot</Table.Cell>
                    <Table.Cell>Houston</Table.Cell>
                    <Table.Cell>Term Note</Table.Cell>
                    <Table.Cell textAlign="right">$20,000</Table.Cell>
                    <Table.Cell>Live</Table.Cell>
                    <Table.Cell collapsing><Progress percent={25} size="small" color="violet" label="25%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button color="green" className="link-button" icon={{ className: 'ns-replay' }} />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell collapsing><Icon className="ns-individual-line" /></Table.Cell>
                    <Table.Cell><Icon className="ns-food offering-icon" /> Intero Ristorante</Table.Cell>
                    <Table.Cell>New York</Table.Cell>
                    <Table.Cell>Term Note</Table.Cell>
                    <Table.Cell textAlign="right">$1,500</Table.Cell>
                    <Table.Cell>Processing</Table.Cell>
                    <Table.Cell collapsing><Progress percent={50} size="small" color="violet" label="50%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button color="green" className="link-button" icon={{ className: 'ns-replay' }} />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell collapsing><Icon className="ns-individual-line" /></Table.Cell>
                    <Table.Cell><Icon className="ns-food offering-icon" /> The Brewers Table</Table.Cell>
                    <Table.Cell>San Francisco</Table.Cell>
                    <Table.Cell>Rev Share</Table.Cell>
                    <Table.Cell textAlign="right">$12,000</Table.Cell>
                    <Table.Cell>Processing</Table.Cell>
                    <Table.Cell collapsing><Progress percent={5} size="small" color="violet" label="5%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button color="green" className="link-button" icon={{ className: 'ns-replay' }} />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell collapsing><Icon className="ns-individual-line" /></Table.Cell>
                    <Table.Cell><Icon className="ns-food offering-icon" /> Smiley Transportat</Table.Cell>
                    <Table.Cell>Boston</Table.Cell>
                    <Table.Cell>Term Note</Table.Cell>
                    <Table.Cell textAlign="right">$4,000</Table.Cell>
                    <Table.Cell>Live</Table.Cell>
                    <Table.Cell collapsing><Progress percent={25} size="small" color="violet" label="25%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button color="green" className="link-button" icon={{ className: 'ns-replay' }} />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell colSpan="3">Total:</Table.HeaderCell>
                    <Table.HeaderCell textAlign="right">$33,900</Table.HeaderCell>
                    <Table.HeaderCell colSpan="3" />
                  </Table.Row>
                </Table.Footer>
              </Table>
            </div>
          </Accordion.Content>
        </Accordion>
      </div>
    </Aux>
  );
};

// <FormDropDown placeholder="Select Account" fluid selection options={options} />
export default Portfolio;
