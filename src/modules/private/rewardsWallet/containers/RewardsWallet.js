import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Checkbox, Header, Table, Card, Button } from 'semantic-ui-react';
import PrivateLayout from '../../../../containers/common/PrivateHOC';

export default class RewardsWallet extends Component {
  render() {
    return (
      <PrivateLayout {...this.props}>
        <Checkbox className="pull-right" label="Show active rewards only" />
        <Header as="h3">MUHU Hot Pot</Header>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable singleLine className="investment-details">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Reward Name</Table.HeaderCell>
                  <Table.HeaderCell width={3}>Status</Table.HeaderCell>
                  <Table.HeaderCell width={3}>Expires</Table.HeaderCell>
                  <Table.HeaderCell width={3} textAlign="center">Redeem date</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Link to="/">$50 Gift Card</Link>
                  </Table.Cell>
                  <Table.Cell>Available</Table.Cell>
                  <Table.Cell>3/3/19</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Button size="tiny" color="green" className="ghost-button" content="Redeem" />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Link to="/">VIP Access Card</Link>
                  </Table.Cell>
                  <Table.Cell>-</Table.Cell>
                  <Table.Cell>3/3/19</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Button size="tiny" color="green" className="ghost-button" content="Redeem" />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Link to="/">$10 Gift Card</Link>
                  </Table.Cell>
                  <Table.Cell>Available</Table.Cell>
                  <Table.Cell>3/3/19</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Button size="tiny" color="green" className="ghost-button" content="Redeem" />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </Card>
        <Header as="h3">The Brewers Table</Header>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable singleLine className="investment-details">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Reward Name</Table.HeaderCell>
                  <Table.HeaderCell width={3}>Status</Table.HeaderCell>
                  <Table.HeaderCell width={3}>Expires</Table.HeaderCell>
                  <Table.HeaderCell width={3} textAlign="center">Redeem date</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Link to="/">Opening Ceremony Invitation</Link>
                  </Table.Cell>
                  <Table.Cell>Invites sent out 3/1/15</Table.Cell>
                  <Table.Cell>3/15/18</Table.Cell>
                  <Table.Cell textAlign="center" className="tertiary-text">Expired</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Link to="/">Free Drink every Saturday</Link>
                  </Table.Cell>
                  <Table.Cell>Available</Table.Cell>
                  <Table.Cell>3/6/18</Table.Cell>
                  <Table.Cell textAlign="center" className="tertiary-text">12-20-2017</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </Card>
        <Header as="h3">Intero Ristorante</Header>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable singleLine className="investment-details">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Reward Name</Table.HeaderCell>
                  <Table.HeaderCell width={3}>Status</Table.HeaderCell>
                  <Table.HeaderCell width={3}>Expires</Table.HeaderCell>
                  <Table.HeaderCell width={3} textAlign="center">Redeem date</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Link to="/">$200 Dinner Voucher</Link>
                  </Table.Cell>
                  <Table.Cell>Available</Table.Cell>
                  <Table.Cell>11/30/18</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Button size="tiny" color="green" disabled className="ghost-button" content="Redeem" />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Link to="/">Free glass of wine every week</Link>
                  </Table.Cell>
                  <Table.Cell>Available</Table.Cell>
                  <Table.Cell>3/6/20</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Button size="tiny" color="green" disabled className="ghost-button" content="Redeem" />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </Card>
      </PrivateLayout>
    );
  }
}
