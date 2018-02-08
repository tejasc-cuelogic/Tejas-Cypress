/* eslint react/no-unused-state: 0 */
/* eslint no-unused-vars: 0 */
import React, { Component } from 'react';
import Aux from 'react-aux';
import Loadable from 'react-loadable';
import UserListing from './../components/UserListing';
import CreateNew from './../components/CreateNew';
import UserDetails from './../components/UserDetails';
import UserModuleSubheader from './../components/UserModuleSubheader';
import adminActions from './../../../actions/admin';

class Users extends Component {
  state = {
    users: [],
  }

  componentDidMount() {
    // fetch data from server and update ...this.setState({users: updatedUsers});
    if (!this.props.adminStore) {
      console.log('im in', typeof this.props.adminStore);
      const params = null;
      // this.searchUsers(params);
    }
  }

  searchUsers = (params) => {
    // fetch data from server and update ...this.setState({users: updatedUsers});
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
    if (this.props.location.pathname === '/users/new') {
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
    } else if (true) {
      content = (
        <Aux>
          <UserModuleSubheader />
          <UserListing header={this.headerMeta} hasPagination />
        </Aux>
      );
    } else {
      content = <div>loading..</div>;
    }

    return content;
  }
}

export default Users;
