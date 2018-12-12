import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import AccountCreation from './AccountCreation';
import ConfirmCancelModal from './ConfirmCancelModal';

@inject('investorProfileStore')
@withRouter
@observer
export default class EstablishProfile extends Component {
  handleCloseModal = () => {
    if (this.props.refUrl) {
      this.props.history.push(this.props.refUrl);
    } else {
      this.props.history.push('/app/summary');
    }
  }
  handleCloseNestedModal = () => {
    this.props.history.push('/app/summary/establish-profile');
  }
  handleFormSubmit = () => {
    this.props.investorProfileStore.submitFieldsForm();
    this.props.history.push('/app/summary/establish-profile');
  }
  render() {
    return (
      <div>
        <AccountCreation
          close={this.handleCloseModal}
          {...this.props}
        />
        <Route path={`${this.props.match.url}/confirm`} render={() => <ConfirmCancelModal refLink={this.props.match.url} />} />
      </div>
    );
  }
}
