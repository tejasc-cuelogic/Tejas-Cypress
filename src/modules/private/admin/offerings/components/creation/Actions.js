import React, { Component } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const actions = {
  edit: { label: 'Edit', icon: 'ns-pencil' },
  delete: { label: 'Delete', icon: 'ns-trash' },
};

export default class Actions extends Component {
  render() {
    return (
      <Table.Cell collapsing textAlign="center">
        {Object.keys(actions).map(action => (
          <Icon as={Link} to="/" className={actions[action].icon} />
        ))}
      </Table.Cell>
    );
  }
}
