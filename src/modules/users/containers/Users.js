import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import UserListing from './../components/UserListing';
import CreateNew from './../components/CreateNew';
import UserDetails from './../components/UserDetails';
import UserModuleSubheader from './../components/UserModuleSubheader';
import adminActions from './../../../actions/admin';

@inject('adminStore', 'userStore')
@observer
class Users extends Component {
  componentDidMount() {
    this.searchUsers();
  }

  searchUsers = () => {
    adminActions.listUsers({ filter: '' });
  }

  headerMeta = [
    ['profilepic', '', false],
    ['full_name', 'Full Name', true],
    ['residence_city', 'Residence City', true],
    ['phone', 'Phone', true],
    ['type', 'Type', true],
    ['last_login', 'Last Login', true],
    ['account_creation', 'Account Creation', true],
    ['actions', '', false],
  ];

  render() {
    let content = null;
    if (this.props.location.pathname === '/app/users/new') {
      content = (
        <Aux>
          <UserModuleSubheader />
          <CreateNew />
        </Aux>
      );
    } else if (this.props.match.params.userId) {
      content = (
        <Aux>
          <UserModuleSubheader />
          <UserDetails />
        </Aux>
      );
    } else if (this.props.adminStore && this.props.adminStore.usersList) {
      content = (
        <Aux>
          <UserModuleSubheader />
          <UserListing
            header={this.headerMeta}
            listData={this.props.adminStore.usersList}
            hasPagination
          />
        </Aux>
      );
    } else {
      content = <div>loading..</div>;
    }

    return content;
  }
}

export default Users;
