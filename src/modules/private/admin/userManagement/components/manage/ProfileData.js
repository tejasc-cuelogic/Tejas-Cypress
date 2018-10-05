import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { InlineLoader } from '../../../../../../theme/shared';
import Investor from './profile/Investor';
import Issuer from './profile/Issuer';
import Admin from './profile/Admin';

@inject('userDetailsStore')
@observer
export default class ProfileData extends Component {
  render() {
    const { detailsOfUser } = this.props.userDetailsStore;
    if (detailsOfUser.loading) {
      return <InlineLoader text="Loading User Details..." />;
    }
    const details = toJS({ ...detailsOfUser.data.user });
    const role = details.roles.map(r => r.scope)[0];
    return role === 'investor' ? <Investor /> : (role === 'issuer' ? <Issuer /> : <Admin />);
  }
}
