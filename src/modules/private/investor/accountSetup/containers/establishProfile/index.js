import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import AccountCreation from './AccountCreation';
import ProfileInterstitial from './ProfileInterstitial';

@inject('investorProfileStore')
@withRouter
@observer
export default class EstablishProfile extends Component {
  handleCloseModal = () => {
    if (this.props.refUrl) {
      this.props.history.push(this.props.refUrl);
    } else {
      this.props.history.push('/dashboard/setup');
    }
  }

  handleCloseNestedModal = () => {
    this.props.history.push('/dashboard/setup/establish-profile');
  }

  render() {
    return (
      <div>
        <AccountCreation
          close={this.handleCloseModal}
          {...this.props}
        />
        <Route path={`${this.props.match.url}/confirm`} render={() => <ProfileInterstitial refLink={this.props.match.url} />} />
      </div>
    );
  }
}
