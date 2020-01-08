import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { startCase, get } from 'lodash';
import { Icon } from 'semantic-ui-react';

@withRouter
export default class AccTypeTitle extends Component {
  getAccType = (url) => {
    const urlParams = url.split('/');
    const accountType = (get(urlParams, '[2]') === 'account-details') ? get(urlParams, '[3]') : get(urlParams, '[6]') === 'investment-details' ? get(urlParams, '[4]') : null;
    return (accountType === 'ira') ? accountType.toUpperCase() : startCase(accountType);
  }

  render() {
    const accountType = this.getAccType(this.props.match.url);
    return (
      <>
        <Icon color="green" className={`ns-${accountType.toLowerCase()}-line`} />
        {`${this.props.noText ? '' : accountType} ${this.props.moreText || ''}`}
      </>
    );
  }
}
