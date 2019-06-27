import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Table, Grid, Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { includes } from 'lodash';
import Helper from '../../../../../helper/utility';

@inject('settingStore')
@withRouter
@observer
export default class Settings extends Component {
  componentWillMount() {
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    const { setSettingsInfo } = this.props.settingStore;
    setSettingsInfo(accountType);
  }

  render() {
    const { settingsInfo } = this.props.settingStore;
    const { match } = this.props;
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
                            {(row.label === 'Annual Income') || (row.label === 'Net Worth') || (row.label === 'Entity net assets') || (row.label === 'Other CF Investments')
                              ? (Helper.CurrencyFormat(row.value)) : (row.value)}
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
                <Header as="h6">Want to update information?</Header>
                <Card.Description>
                  <p>If any of this information needs to be updated.
                  please contact support through the message center.
                  </p>
                  <p><Link to={match.url}>Contact us now</Link></p>
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
