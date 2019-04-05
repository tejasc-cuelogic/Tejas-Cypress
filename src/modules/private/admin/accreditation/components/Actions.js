import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

const actions = {
  approve: { label: 'Approve', color: 'green', actionValue: 'CONFIRMED' },
  decline: { label: 'Decline', color: 'red', actionValue: 'INVALID' },
};

@inject('accreditationStore')
@observer
export default class Actions extends Component {
  actionUrl = (action) => {
    const {
      match, accountId, accountType, userId,
    } = this.props;
    return `${match.url}/${action}/${userId}${accountId ? `/${accountId}/${accountType}` : ''}`;
  }
  render() {
    return (
      <Table.Cell collapsing textAlign="center">
        <Button.Group vertical compact size="mini">
          {this.props.accreditation.verifier &&
            this.props.accreditation.verifier.email &&
            <Button loading={this.props.accreditationStore.inProgress.includes(this.props.userId)} onClick={() => this.props.emailVerifier(this.props.userId, this.props.accountId, this.props.accountType)} className="green" >Email Verifier </Button>
          }
          {Object.keys(actions).map(action => (
            <Button
              as={Link}
              to={this.actionUrl(actions[action].actionValue)}
              className={actions[action].color}
            >
              {actions[action].label}
            </Button>
          ))}
        </Button.Group>
      </Table.Cell>
    );
  }
}
