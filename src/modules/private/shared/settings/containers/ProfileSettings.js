import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../../shared/PrivateLayout';
import { GetNavMeta } from '../../../../../theme/layout/SidebarNav';
import ProfileData from '../components/ProfileData';
import InvestmentLimits from '../../../investor/settings/containers/InvestmentLimits';
import Security from '../components/Security';
import Beneficiaries from '../../../investor/settings/containers/Beneficiaries';
import Agreements from '../../../investor/settings/containers/Agreements';

const getModule = (component) => {
  let c = null;
  switch (component) {
    case 'InvestmentLimits': c = InvestmentLimits; break;
    case 'Security': c = Security; break;
    case 'Beneficiaries': c = Beneficiaries; break;
    case 'Agreements': c = Agreements; break;
    default: c = ProfileData; break;
  }
  return c;
};


export default class ProfileSettings extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/profile-data`);
    }
  }
  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url).subNavigations;
    return (
      <PrivateLayout {...this.props}>
        <Switch>
          <Route exact path={match.url} component={getModule(navItems[0].component)} />
          {
            navItems.map(item => (
              <Route key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
            ))
          }
        </Switch>
      </PrivateLayout>
    );
  }
}
