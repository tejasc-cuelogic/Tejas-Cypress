import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Table, Grid, Card } from 'semantic-ui-react';
import { inject } from 'mobx-react';
import Helper from '../../../../../helper/utility';


@inject('settingStore')
export default class Settings extends Component {
  render() {
    const { settingsInfo } = this.props.settingStore;
    return (
      <div>
        <Header as="h4">Settings</Header>
        <Grid>
          <Grid.Column widescreen={12} largeScreen={11} computer={10} tablet={10} mobile={16}>
            <Card fluid>
              <Card.Content>
                <div className="table-wrapper">
                  <Table unstackable basic="very" fixed singleLine>
                    <Table.Body>
                      {settingsInfo.map(row => (
                        <Table.Row>
                          <Table.Cell><b>{row.label}</b></Table.Cell>
                          <Table.Cell>
                            {(row.label === 'Annual Income') || (row.label === 'Net Worth') ?
                              (Helper.CurrencyFormat(row.value)) : (row.value)}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column widescreen={4} largeScreen={5} computer={6} tablet={6} mobile={16}>
            <Card>
              <Card.Content>
                <Header as="h6"> Want to update information? </Header>
                <Card.Description>
                  <p>If any of this information needs to be updated.
                  please contact support through the message center.
                  </p>
                  <p><Link to="/">Contact us now</Link></p>
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
