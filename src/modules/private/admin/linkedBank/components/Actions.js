import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';

const actions = {
  approve: { label: 'Verify', color: 'green', actionValue: 'Verified' },
};
export default class Actions extends Component {
  render() {
    return (
      <Table.Cell collapsing textAlign="center">
        <Button.Group vertical compact size="mini">
          {Object.keys(actions).map(action => (
            <Button
              className={actions[action].color}
              onClick={
                () => this.props.updateAccountChangeAction(this.props.accountId, this.props.userId)
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
