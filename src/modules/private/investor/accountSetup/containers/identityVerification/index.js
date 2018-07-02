import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import LegalDetails from '../../components/identityVerification/LegalDetails';

@inject('uiStore', 'identityStore')
@withRouter
@observer
export default class IdentityVerification extends Component {
  handleCloseModal = () => {
    this.props.history.push('/app/summary/');
  }
  render() {
    const { ID_VERIFICATION_FRM, personalInfoChange } = this.props.identityStore;
    return (
      <LegalDetails
        form={ID_VERIFICATION_FRM}
        close={this.handleCloseModal}
        change={personalInfoChange}
      />
    );
  }
}
