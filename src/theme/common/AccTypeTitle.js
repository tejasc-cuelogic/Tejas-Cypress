import React, { Component } from 'react';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import startCase from 'lodash/startCase';
import { Icon } from 'semantic-ui-react';

@withRouter
export default class AccTypeTitle extends Component {
  getAccType = (url) => {
    const urlParams = url.split('/');
    const accountType = (urlParams[2] === 'account-details') ? urlParams[3] : null;
    return (accountType === 'ira') ? accountType.toUpperCase() : startCase(accountType);
  }
  render() {
    const accountType = this.getAccType(this.props.match.url);
    return (
      <Aux>
        <Icon color="teal" className={`ns-${accountType.toLowerCase()}-line`} />
        {`${this.props.noText ? '' : accountType} ${this.props.moreText || ''}`}
      </Aux>
    );
  }
}

