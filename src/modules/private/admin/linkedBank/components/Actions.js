import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

const actions = {
  approve: { label: 'Verify', color: 'green', actionValue: 'Verified' },
  // deny: { label: 'Deny', color: 'red', actionValue: 'Denied' },
};

@inject('bankAccountStore')
@observer
export default class Actions extends Component {
  handleOnClickAction(action) {
    const { updateAccountChangeAction, accountId, userId } = this.props;
    updateAccountChangeAction(accountId, userId, action === 'deny').then().catch();
  }
  render() {
    const { loadingRequestIds } = this.props.bankAccountStore;
    return (
      <Table.Cell collapsing textAlign="center">
        <Button.Group vertical compact size="mini">
          {Object.keys(actions).map(action => (
            <Button
              loading={loadingRequestIds.includes(this.props.userId)}
              className={actions[action].color}
              onClick={
                () => this.handleOnClickAction(action)}
            >
              {actions[action].label}
            </Button>
            ))}
        </Button.Group>
      </Table.Cell>
    );
  }
}
