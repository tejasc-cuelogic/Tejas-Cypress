import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Header, Card, Grid, Statistic, Popup, Icon, Table, Accordion, Progress, Button, Divider } from 'semantic-ui-react';
import InvestmentDetails from './InvestmentDetails';

@inject('uiStore')
@observer
export default class Portfolio extends Component {
  render() {
    return (
      <div className="content-spacer">
        <InvestmentDetails />
        <Card fluid className="investment-summary">
          <Card.Content>
            <Card.Header><Icon className="ns-individual-line" /> Individual</Card.Header>
          </Card.Content>
          <Divider className="only-border" />
          <Grid divided padded="horizontally">
            <Grid.Row>
              <Grid.Column mobile={1} tablet={8} computer={4}>
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
                    <Statistic.Label as="a">Deposit funds</Statistic.Label>
                  </Statistic>
                </Card.Content>
              </Grid.Column>
              <Grid.Column mobile={1} tablet={8} computer={4}>
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
              <Grid.Column mobile={1} tablet={8} computer={4}>
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
              <Grid.Column mobile={1} tablet={8} computer={4}>
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
                    <Table.Cell collapsing><Icon className="ns-individual-line" /></Table.Cell>
                    <Table.Cell>
                      <Icon className="ns-food offering-icon" /> <Link to="/app/individual" onClick={() => this.props.uiStore.setModalStatus('InvestmentDetails')}>MUHU Hot Pot</Link>
                    </Table.Cell>
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
                    <Table.Cell>
                      <Icon className="ns-food offering-icon" /> <Link to="">Intero Ristorante</Link>
                    </Table.Cell>
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
                    <Table.Cell>
                      <Icon className="ns-food offering-icon" /> <Link to="">The Brewers Table</Link>
                    </Table.Cell>
                    <Table.Cell>San Francisco</Table.Cell>
                    <Table.Cell>Rev Share</Table.Cell>
                    <Table.Cell textAlign="right">$12,000</Table.Cell>
                    <Table.Cell>Processing</Table.Cell>
                    <Table.Cell collapsing><Progress percent={5} size="small" color="violet" label="5%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button size="tiny" color="red" className="ghost-button" disabled>Cancel</Button>
                      <Button color="green" className="link-button" icon={{ className: 'ns-replay' }} />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell collapsing><Icon className="ns-individual-line" /></Table.Cell>
                    <Table.Cell>
                      <Icon className="ns-food offering-icon" /> <Link to="">Smiley Transportat</Link>
                    </Table.Cell>
                    <Table.Cell>Boston</Table.Cell>
                    <Table.Cell>Term Note</Table.Cell>
                    <Table.Cell textAlign="right">$4,000</Table.Cell>
                    <Table.Cell>Live</Table.Cell>
                    <Table.Cell collapsing><Progress percent={25} size="small" color="violet" label="25%" /></Table.Cell>
                    <Table.Cell collapsing>
                      <Button size="tiny" color="red" className="ghost-button" disabled>Cancel</Button>
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
                    <Table.Cell collapsing><Icon className="ns-individual-line" /></Table.Cell>
                    <Table.Cell>
                      <Icon className="ns-food offering-icon" /> <Link to="/app/individual" onClick={() => this.props.uiStore.setModalStatus('InvestmentDetails')}>MUHU Hot Pot</Link>
                    </Table.Cell>
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
                    <Table.Cell>
                      <Icon className="ns-food offering-icon" /> <Link to="">Intero Ristorante</Link>
                    </Table.Cell>
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
                    <Table.Cell>
                      <Icon className="ns-food offering-icon" /> <Link to="">The Brewers Table</Link>
                    </Table.Cell>
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
                    <Table.Cell>
                      <Icon className="ns-food offering-icon" /> <Link to="">Smiley Transportat</Link>
                    </Table.Cell>
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
                    <Table.Cell collapsing><Icon className="ns-individual-line" /></Table.Cell>
                    <Table.Cell>
                      <Icon className="ns-food offering-icon" /> <Link to="/app/individual" onClick={() => this.props.uiStore.setModalStatus('InvestmentDetails')}>MUHU Hot Pot</Link>
                    </Table.Cell>
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
                    <Table.Cell>
                      <Icon className="ns-food offering-icon" /> <Link to="">Intero Ristorante</Link>
                    </Table.Cell>
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
                    <Table.Cell>
                      <Icon className="ns-food offering-icon" /> <Link to="">The Brewers Table</Link>
                    </Table.Cell>
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
                    <Table.Cell>
                      <Icon className="ns-food offering-icon" /> <Link to="">Smiley Transportat</Link>
                    </Table.Cell>
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
    );
  }
}
