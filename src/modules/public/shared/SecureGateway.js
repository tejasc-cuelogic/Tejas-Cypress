import React from 'react';
import queryString from 'query-string';
import { InlineLoader } from './../../../theme/shared';

export default class SecureGateway extends React.Component {
  componentWillMount() {
    // dont bother if there is no EID or no user logged in
    const parsedHash = queryString.parse(this.props.location.search);
    if (!parsedHash.event) {
      this.props.history.push('/');
    } else {
      window.parent.postMessage(parsedHash.event, '*');
    }
  }
  render() {
    return (
      <InlineLoader />
    );
  }
}
