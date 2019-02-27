import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';

const actions = {
  approve: { label: 'Verify', color: 'green', actionValue: 'Verified' },
  deny: { label: 'Deny', color: 'red', actionValue: 'Denied' },
};
export default class Actions extends Component {
  render() {
    return (
      <Table.Cell collapsing textAlign="center">
        <Button.Group vertical compact size="mini">
          {Object.keys(actions).map(action => (
            <Button
              loading={this.props.inProgress === `${this.props.accountId}_${action}`}
              className={actions[action].color}
              onClick={
                () => this.props.updateAccountChangeAction(this.props.accountId, this.props.userId, action === 'deny')
              }
            >
              {actions[action].label}
            </Button>
          ))}
        </Button.Group>
      </Table.Cell>
    );
  }
}
