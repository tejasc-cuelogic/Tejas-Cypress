import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Header, Card, Grid, Statistic, Popup, Icon, Tab, Table, List } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

const panes = [
  {
    menuItem: 'Transactions',
    render: () => (
      <Tab.Pane attached="bottom">
        <div className="table-wrapper">
          <Table singleLine className="investment-details" textAlign="right">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="left">Payment date</Table.HeaderCell>
                <Table.HeaderCell>Payment Received</Table.HeaderCell>
                <Table.HeaderCell>Interest Paid</Table.HeaderCell>
                <Table.HeaderCell>Principal<br />Paid</Table.HeaderCell>
                <Table.HeaderCell>Service Fees</Table.HeaderCell>
                <Table.HeaderCell>Net Payment<br />Received</Table.HeaderCell>
                <Table.HeaderCell width={2}>Net Payment<br />Received</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell collapsing textAlign="left">01-24-2018</Table.Cell>
                <Table.Cell className="positive-text">$5000</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell collapsing>$20,000</Table.Cell>
                <Table.Cell collapsing>$340</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell collapsing textAlign="left">01-24-2018</Table.Cell>
                <Table.Cell className="positive-text">$5000</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell collapsing>$20,000</Table.Cell>
                <Table.Cell collapsing>$340</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell collapsing textAlign="left">01-24-2018</Table.Cell>
                <Table.Cell className="positive-text">$5000</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell collapsing>$20,000</Table.Cell>
                <Table.Cell collapsing>$340</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell collapsing textAlign="left">01-24-2018</Table.Cell>
                <Table.Cell className="positive-text">$5000</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell collapsing>$20,000</Table.Cell>
                <Table.Cell collapsing>$340</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell collapsing textAlign="left">01-24-2018</Table.Cell>
                <Table.Cell className="positive-text">$5000</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell collapsing>$20,000</Table.Cell>
                <Table.Cell collapsing>$340</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell collapsing textAlign="left">01-24-2018</Table.Cell>
                <Table.Cell className="positive-text">$5000</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell collapsing>$20,000</Table.Cell>
                <Table.Cell collapsing>$340</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell collapsing textAlign="left">01-24-2018</Table.Cell>
                <Table.Cell className="positive-text">$5000</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell collapsing>$20,000</Table.Cell>
                <Table.Cell collapsing>$340</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell collapsing textAlign="left">01-24-2018</Table.Cell>
                <Table.Cell className="positive-text">$5000</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell collapsing>$20,000</Table.Cell>
                <Table.Cell collapsing>$340</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell collapsing textAlign="left">01-24-2018</Table.Cell>
                <Table.Cell className="positive-text">$5000</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell collapsing>$20,000</Table.Cell>
                <Table.Cell collapsing>$340</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell collapsing textAlign="left">01-24-2018</Table.Cell>
                <Table.Cell className="positive-text">$5000</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell>$3,020.20</Table.Cell>
                <Table.Cell collapsing>$20,000</Table.Cell>
                <Table.Cell collapsing>$340</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </Tab.Pane>),
  },
  {
    menuItem: 'Updates',
    render: () => (
      <Tab.Pane attached="bottom">
        <Grid padded="horizontally" relaxed="very">
          <Grid.Column width={4} className="update-list">
            <h3>Recent</h3>
            <List relaxed="very">
              <List.Item as="a">Jan 23th 2018</List.Item>
              <List.Item as="a" className="active">Dec 17th 2017</List.Item>
              <List.Item as="a">Dec 17th 2017</List.Item>
              <List.Item as="a">Dec 17th 2017</List.Item>
              <List.Item as="a">Dec 17th 2017</List.Item>
              <List.Item as="a">Dec 17th 2017</List.Item>
              <List.Item as="a">Dec 17th 2017</List.Item>
              <List.Item as="a">Dec 17th 2017</List.Item>
              <List.Item as="a">Dec 17th 2017</List.Item>
              <List.Item as="a">Dec 17th 2017</List.Item>
            </List>
          </Grid.Column>
          <Grid.Column width={2} only="computer" />
          <Grid.Column width={12} computer={8}>
            <h3>Details</h3>
          </Grid.Column>
        </Grid>
      </Tab.Pane>),
  },
  { menuItem: 'Bonus Rewards', render: () => <Tab.Pane attached="bottom">Tab 3 Content</Tab.Pane> },
];

@inject('uiStore')
@observer
class InvestmentDetails extends Component {
  handleCloseModal = () => {
    this.props.uiStore.setModalStatus(false);
  }
  render() {
    return (
      <Modal closeIcon size="large" dimmer="inverted" open={this.props.uiStore.modalStatus === 'InvestmentDetails'} onClose={this.handleCloseModal}>
        <Modal.Content className="transaction-detials">
          <Header as="h2">
            The Brewers Table
            <span className="title-meta"><Icon className="ns-individual-line" />Individual investment</span>
            <span className="title-meta"><Link to="">View offering page</Link></span>
          </Header>
          <Card fluid>
            <Grid divided stackable padded="horizontally" doubling columns={5}>
              <Grid.Row>
                <Grid.Column>
                  <Card.Content>
                    <Statistic size="mini">
                      <Statistic.Label>
                        Total invested amount
                        <Popup
                          trigger={<Icon className="ns-help-circle" />}
                          content="Your Total invested amount as of today"
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
                    <Statistic size="mini">
                      <Statistic.Label>
                        Status
                        <Popup
                          trigger={<Icon className="ns-help-circle" />}
                          content="Your Status as of today"
                          position="top center"
                          className="center-align"
                        />
                      </Statistic.Label>
                      <Statistic.Value>Funded</Statistic.Value>
                    </Statistic>
                  </Card.Content>
                </Grid.Column>
                <Grid.Column>
                  <Card.Content>
                    <Statistic size="mini">
                      <Statistic.Label>
                        Date
                        <Popup
                          trigger={<Icon className="ns-help-circle" />}
                          content="Date of investment started"
                          position="top center"
                          className="center-align"
                        />
                      </Statistic.Label>
                      <Statistic.Value>May 5<sup>th</sup>, 2018</Statistic.Value>
                    </Statistic>
                  </Card.Content>
                </Grid.Column>
                <Grid.Column>
                  <Card.Content>
                    <Statistic size="mini">
                      <Statistic.Label>
                        Net Payments Received
                        <Popup
                          trigger={<Icon className="ns-help-circle" />}
                          content="Your Net Payments Received till date"
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
                    <Statistic size="mini">
                      <Statistic.Label>
                        Net Annualied Returns
                        <Popup
                          trigger={<Icon className="ns-help-circle" />}
                          content="Your Net Annualied Returns till date"
                          position="top center"
                          className="center-align"
                        />
                      </Statistic.Label>
                      <Statistic.Value>10.28%</Statistic.Value>
                    </Statistic>
                  </Card.Content>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card>
          <Card fluid>
            <Tab menu={{ attached: 'top', inverted: 'true' }} panes={panes} />
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}

export default InvestmentDetails;
