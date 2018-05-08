import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Header, Card, Grid, Statistic, Popup, Icon, Tab, Table, List, Embed } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import videoPoster from '../../../assets/images/683547643.webp';

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
            <Header as="h3">Recent</Header>
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
          <Grid.Column width={1} only="computer" />
          <Grid.Column width={12} computer={10} className="update-details">
            <Header as="h3">Featurette on Ben McPherson and BOH Pasta</Header>
            <Header as="h6">Dec 17th 2017</Header>
            <Embed
              id="255991323"
              placeholder={videoPoster}
              source="vimeo"
            />
            <p>Check out our chef featurette video on Ben McPherson, Founder of Krisp Bird &
              Batter. He was inspired by trips with his father to Italy and is bringing the
              concept of BOH Pasta to the Bravery Chef Hall.
            </p>
            <p>“In Naples, Italy is where I found my passion for food” states Ben. “BOH Pasta
              will use a simple technique with the best ingredients.”
            </p>
            <p>We are so excited to have him on our team!</p>
            <p>Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui,
              non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et
              ligula. Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis
              ac, laoreet enim. Phasellus fermentum in, dolor. Pellentesque facilisis.
            </p>
            <p>Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac
              turpis velit, rhoncus eu, luctus et interdum adipiscing wisi. Aliquam erat ac ipsum.
              Integer aliquam purus
            </p>
            <p>Quisque lorem tortor fringilla sed, vestibulum id, eleifend justo vel bibendum
              sapien massa ac turpis faucibus
            </p>
          </Grid.Column>
        </Grid>
      </Tab.Pane>),
  },
  {
    menuItem: 'Bonus Rewards',
    render: () => (
      <Tab.Pane attached="bottom">
        <div className="inner-content-spacer">
          <Header as="h3">Your investment</Header>
          <Grid columns="equal" textAlign="center" className="investment-scale">
            <Grid.Row>
              <Grid.Column className="crossed">
                <Popup
                  trigger={<span>$500</span>}
                  position="bottom center"
                  wide
                  on="click"
                >
                  <Header as="h3">Invest $500 or more</Header>
                  <Header as="h5">Cooking Class</Header>
                  <List bulleted>
                    <List.Item>$50 Gift Card</List.Item>
                    <List.Item>Invitation for 2 to the Launch Party</List.Item>
                  </List>
                </Popup>
              </Grid.Column>
              <Grid.Column>
                $1,000
              </Grid.Column>
              <Grid.Column>
                $2,500
              </Grid.Column>
              <Grid.Column>
                $5,000
              </Grid.Column>
              <Grid.Column>
                $10,000
              </Grid.Column>
              <Grid.Column>
                $25,000
              </Grid.Column>
              <Grid.Column>
                $50,000
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Tab.Pane>),
  },
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
