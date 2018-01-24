import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import UserRow from './components/UserRow';
import UserSearch from './components/UserSearch';
import adminActions from './../../../../actions/admin';

@inject('adminStore', 'userStore')
@observer
export default class UsersList extends React.Component {
  componentWillMount() {
    adminActions.listUsers({ filter: '' });
  }

  handleDeleteClick = username => adminActions.deleteUser(username)
  handleSearch = (e) => {
    if (e.key === 'Enter') {
      adminActions.searchUser(e.target.value);
    }
  }

  render() {
    if (this.props.adminStore.usersList) {
      return (
        <div>
          <Button as={Link} to="/admin/user/new">Add New User</Button>
          <UserSearch
            handleSearch={this.handleSearch}
          />
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
              {_.map(this.props.adminStore.usersList, user => (
                <UserRow
                  {...user}
                  handleDeleteClick={this.handleDeleteClick}
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
