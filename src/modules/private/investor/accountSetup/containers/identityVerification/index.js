import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import LegalDetails from '../../components/identityVerification/LegalDetails';

@inject('uiStore', 'identityStore')
@withRouter
@observer
export default class IdentityVerification extends Component {
  handleCloseModal = () => {
    if (this.props.refLink) {
      this.props.history.push(this.props.refLink);
    }
  }
  render() {
    const { ID_VERIFICATION_FRM, personalInfoChange } = this.props.identityStore;
    return (
      <LegalDetails form={ID_VERIFICATION_FRM} change={personalInfoChange} />
    );
  }
}
