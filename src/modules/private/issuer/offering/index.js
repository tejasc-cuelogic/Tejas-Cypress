import React, { Component } from 'react';
// import { Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../shared/PrivateHOC';
// import { GetNavMeta } from '../../../../theme/layout/SidebarNav';

export default class Offering extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/overview`);
    }
  }
  render() {
    // const { match } = this.props;
    // const navItems = GetNavMeta(match.url).subNavigations;
    return (
      <PrivateLayout {...this.props}>
        hello..
      </PrivateLayout>
    );
  }
}
