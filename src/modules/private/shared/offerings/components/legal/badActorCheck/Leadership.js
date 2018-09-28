import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route } from 'react-router-dom';
import SecondaryMenu from '../../../../../../../theme/layout/SecondaryMenu';
import Leader from './Leader';

@inject('offeringCreationStore', 'offeringsStore')
@observer
export default class Leadership extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/leader/1`);
    }
    if (!this.props.offeringCreationStore.initLoad.includes('LEADER_FRM')) {
      this.props.offeringCreationStore.setFormData('LEADER_FRM', 'leadership');
    }
  }
  render() {
    const { LEADER_FRM } = this.props.offeringCreationStore;
    const navItems = [];
    LEADER_FRM.fields.data.map((leader, index) => {
      navItems.push({ title: `Leader ${index + 1}`, to: `leader/${index + 1}` });
      return navItems;
    });
    const { match } = this.props;
    // const { isIssuer } = this.props.userStore;
    const { offer } = this.props.offeringsStore;
    return (
      <div className={offer.stage === 'CREATION' ? 'ui card fluid' : ''}>
        <SecondaryMenu className={offer.stage !== 'CREATION' ? 'tertiary' : ''} match={match} navItems={navItems} />
        <Switch>
          <Route
            exact
            path={match.url}
            render={props =>
              <Leader refLink={match.url} {...props} index={0} />}
          />
          {
            navItems.map((item, index) => (
              <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} render={props => <Leader refLink={match.url} {...props} index={index || 0} />} />
            ))
          }
        </Switch>
      </div>
    );
  }
}
