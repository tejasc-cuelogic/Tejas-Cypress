import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Modal, Grid, Table, Popup, Icon, Divider } from 'semantic-ui-react';

class TermNoteKeyTerms extends Component {
  render() {
    return (
      <Modal.Content>
        <Grid columns={3} stackable doubling divided className="investment-terms">
          <Grid.Row>
            <Grid.Column>
              <p><b>Issuer</b></p>
              <p>Buffbrew Taproom, LLC</p>
            </Grid.Column>
            <Grid.Column>
              <p><b>Securities</b></p>
              <p>Term Note</p>
            </Grid.Column>
            <Grid.Column>
              <p><b>Offering Amount</b></p>
              <p>Min. $250,000 to max. $1,000,000</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table basic="very">
          <Table.Body>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Investment Multiple</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p><b>1.70x to 1.90x</b></p>

                <p>
                If the final offering amount raised is less than or equal to $600,000,
                the investment multiple will be 1.70x.
                </p>
                <p>
                If the final offering amount raised is greater than $600,000 but
                less than or equal to $800,000, the investment multiple will be 1.80x.
                </p>
                <p>
                If the final offering amount raised is greater than $800,000 but less
                than or equal to $1,000,000, the investment multiple will be 1.90x.
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top" >
              <Table.Cell width={5}><b>Payments</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p><b>Monthly</b></p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell><b>Revenue Sharing Percentage</b></Table.Cell>
              <Table.Cell>
                <p>
                Buffbrew Taproom&apos;s revenue streams will come from tap sales, restaurant
                sales, beer garden sales and facility tour and event sales.
                </p>
                <p>
                If the final offering amount raised is less than or equal to $400,000, then
                4% of monthly gross revenue will be shared.
                </p>
                <p>
                If the final offering amount raised is greater than $400,000 but less than
                or equal to $600,000, then 4% of monthly gross revenue will be shared
                during the first 12 months of operation, then 7% thereafter.
                </p>
                <p>
                If the final offering amount raised is greater than $600,000 but less than
                or equal to $800,000, then 4% of monthly gross revenue will be shared
                during the first 12 months of operation, then 10.25% thereafter.
                </p>
                <p>
                If the final offering amount raised is greater than $800,000 but less than
                or equal to $1,000,000, then 4% of monthly gross revenue will be shared
                during the first 12 months of operation, then 13.5% thereafter.
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Maturity</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p><b>78 Months,</b> including a 6 month startup period for ramp up</p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Security Interest</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p>Blanket lien on all assets of the business</p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}>
                <b>Ownership % Represented by Securities</b>
              </Table.Cell>
              <Table.Cell>
                <p>
                  <b>0%.</b> Investors will not receive any equity interests in the Issuer or
                  any voting or management rights with respect to the Issuer as a result of
                  an investment in Securities.
                </p>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Divider />
        <Header as="h5" className="center-align">
          <Link to="/">
        View the Issuer&apos;s SEC Form C filing
          </Link>
        </Header>
      </Modal.Content>
    );
  }
}

export default TermNoteKeyTerms;
