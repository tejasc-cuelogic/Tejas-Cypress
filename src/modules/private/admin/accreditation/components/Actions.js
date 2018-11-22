import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button } from 'semantic-ui-react';

const actions = {
  approve: { label: 'Approve', color: 'green', actionValue: 'APPROVE' },
  decline: { label: 'Decline', color: 'red', actionValue: 'DECLINE' },
};
export default class Actions extends Component {
  render() {
    const { accountId, accountType, userId } = this.props;
    return (
      <Table.Cell collapsing textAlign="center">
        <Button.Group vertical compact size="mini">
          {Object.keys(actions).map(action => (
            <Button as={Link} to={`${this.props.match.url}/${actions[action].actionValue}/${userId}/${accountId}/${accountType}`} className={actions[action].color}>
              {actions[action].label}
            </Button>
          ))}
        </Button.Group>
      </Table.Cell>
    );
  }
}
