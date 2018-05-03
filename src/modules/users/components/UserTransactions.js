import React from 'react';
import { Header, Grid, Card, Table, Icon } from 'semantic-ui-react';

/* eslint-disable arrow-body-style */
const userTransactions = () => {
  return (
    <div className="content-spacer">
      <Header as="h3">Transactions</Header>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column mobile={1} tablet={8} computer={11}>
            <Card fluid>
              <div className="table-wrapper">
                <Table className="investment-details">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Date</Table.HeaderCell>
                      <Table.HeaderCell>Account</Table.HeaderCell>
                      <Table.HeaderCell>Description</Table.HeaderCell>
                      <Table.HeaderCell textAlign="right">Amount</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>03-24-2018</Table.Cell>
                      <Table.Cell><Icon name="ns-individual-line" /> Individual</Table.Cell>
                      <Table.Cell>Automatic Deposit</Table.Cell>
                      <Table.Cell textAlign="right">$500.00</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>02-26-2018</Table.Cell>
                      <Table.Cell><Icon name="ns-entity-line" /> Entity</Table.Cell>
                      <Table.Cell>Withdrawal</Table.Cell>
                      <Table.Cell textAlign="right">$500.00</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>01-23-2018</Table.Cell>
                      <Table.Cell><Icon name="ns-individual-line" /> Individual</Table.Cell>
                      <Table.Cell>Withdrawal</Table.Cell>
                      <Table.Cell textAlign="right">$500.00</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>01-15-2018</Table.Cell>
                      <Table.Cell><Icon name="ns-individual-line" /> Entity</Table.Cell>
                      <Table.Cell>Automatic Deposit</Table.Cell>
                      <Table.Cell textAlign="right">$500.00</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>03-24-2018</Table.Cell>
                      <Table.Cell><Icon name="ns-individual-line" /> Individual</Table.Cell>
                      <Table.Cell>Automatic Deposit</Table.Cell>
                      <Table.Cell textAlign="right">$500.00</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>
            </Card>
          </Grid.Column>
          <Grid.Column mobile={1} tablet={8} computer={5}>
            <Header as="h3">Transactions</Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default userTransactions;
