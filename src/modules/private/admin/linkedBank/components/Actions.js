import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter, Route } from 'react-router-dom';
import ConfirmModel from './confirmModel';

const actions = {
  approve: { label: 'Verify', color: 'green', actionValue: 'Verified' },
  deny: { label: 'Deny', color: 'red', actionValue: 'Denied' },
};

@inject('bankAccountStore')
@withRouter
@observer
export default class Actions extends Component {
  handleOnClickAction(action) {
    this.props.history.push(`/app/change-linked-bank-requests/${this.props.accountId}/${action}`);
  }

  render() {
    const { loadingRequestIds } = this.props.bankAccountStore;
    const { match, accountId, userId } = this.props;
    return (
      <Table.Cell collapsing textAlign="center">
        <Button.Group vertical compact size="mini">
          {!this.props.isLocked ? Object.keys(actions).map(action => (
            <Button
              loading={loadingRequestIds.includes(this.props.userId)}
              className={actions[action].color}
              onClick={
                () => this.handleOnClickAction(action)}
            >
              {actions[action].label}
            </Button>
          ))
            : <Button disabled className="red">Locked</Button>
          }
        </Button.Group>
        <Route exact path={`${match.url}/${accountId}/:action`} render={props => <ConfirmModel {...props} userId={userId} accountId={accountId} refLink={match.url} />} />
      </Table.Cell>
    );
  }
}
