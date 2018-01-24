import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import UserRow from './components/UserRow';
import adminActions from './../../../../actions/admin';

@inject('adminStore', 'userStore')
@observer
export default class UsersList extends React.Component {
  componentDidMount() {
    adminActions.listUsers();
  }

  handleDisableClick = (e) => {
    adminActions.disableUser(e.target.dataUsername);
  }

  render() {
    if (this.props.adminStore.usersList) {
      return (
        <div>
          <Button as={Link} to="/admin/user/new">Add New User</Button>
          <Table celled width={10}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>User ID</Table.HeaderCell>
                <Table.HeaderCell width={4}>Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.adminStore.usersList.map(user => (
                <UserRow
                  {...user}
                  handleDisableClick={this.handleDisableClick}
                  key={`key_${user.username}`}
                />
              ))}
            </Table.Body>
          </Table>
        </div>
      );
    }
    return (
      <div>
        <p>No Users Found</p>
      </div>
    );
  }
}
