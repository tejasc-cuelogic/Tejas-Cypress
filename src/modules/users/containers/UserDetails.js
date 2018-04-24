import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import UserModuleSubheader from './../components/UserModuleSubheader';
import UserDetail from './../components/UserDetail';

@inject('userDetailsStore')
@observer
class UserDetails extends Component {
  componentWillMount() {
    this.props.userDetailsStore.getUser(this.props.match.params.userId);
  }

  render() {
    const {
      userDetails, editCard, setEditCard, save,
    } = this.props.userDetailsStore;
    return (
      <Aux>
        <UserModuleSubheader
          fullname={`${userDetails.firstName} ${userDetails.lastName}`}
          section={this.props.match.params.section}
          id={userDetails.id}
        />
        <UserDetail
          editCard={editCard}
          setEditCard={setEditCard}
          details={userDetails}
          save={save}
        />
      </Aux>
    );
  }
}

export default UserDetails;
