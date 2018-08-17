import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';

const actions = {
  're-create': { label: 'Re-Create', color: 'green' },
  decline: { label: 'Decline', color: 'red' },
  validate: { label: 'Validate', color: 'blue', inverted: true },
};

export default class Actions extends Component {
  render() {
    return (
      <Table.Cell width={1} textAlign="center">
        <Button.Group vertical compact size="mini">
          {Object.keys(actions).map(action => (
            <Button inverted={action.inverted} color={actions[action].color}>
              {actions[action].label}
            </Button>
          ))}
        </Button.Group>
      </Table.Cell>
    );
  }
}
