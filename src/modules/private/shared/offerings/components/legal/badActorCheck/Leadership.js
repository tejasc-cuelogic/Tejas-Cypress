import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get, sortBy, findIndex } from 'lodash';
import { Switch, Route } from 'react-router-dom';
import SecondaryMenu from '../../../../../../../theme/layout/SecondaryMenu';
import Leader from './Leader';

@inject('offeringCreationStore', 'userStore', 'offeringsStore')
@observer
export default class Leadership extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/leader/1`);
    }
    if (!this.props.offeringCreationStore.initLoad.includes('LEADERSHIP_FRM')) {
      this.props.offeringCreationStore.setFormData('LEADERSHIP_FRM', false);
    }
    const {
      getLeadershipOfferingBac,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    getLeadershipOfferingBac(currentOfferingId, 'LEADERSHIP');
  }

  render() {
    const { LEADER_FRM } = this.props.offeringCreationStore;
    const { getOfferingDetailsBySlug } = this.props.offeringsStore.offerData.data;
    let navItems = [];
    if (getOfferingDetailsBySlug.leadership) {
      getOfferingDetailsBySlug.leadership.map((leader, index) => {
        navItems.push({ title: get(leader, 'firstName') || `Leader ${index + 1}`, to: `leader/${index + 1}`, bacId: leader.leaderBacId });
        return navItems;
      });
    }

    if (navItems.length) {
      const sortedCollection = sortBy(navItems, (leader) => {
        let actualIndx;
        const orderedIndx = findIndex(LEADER_FRM.fields.getOfferingBac, fild => fild.id.value === leader.bacId);
        if (orderedIndx >= 0) {
          actualIndx = orderedIndx;
        }
        return actualIndx;
      });
      navItems = sortedCollection;
    }

    const { match } = this.props;
    const { isIssuer } = this.props.userStore;
    if (navItems.length === 0) {
      return <p className="center-align mt-40">No Leaders to Display!</p>;
    }
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? '' : 'ui card fluid'}>
        <SecondaryMenu className={!isIssuer ? 'tertiary' : ''} match={match} navItems={navItems} />
        <Switch>
          <Route
            exact
            path={match.url}
            render={props => <Leader refLink={match.url} {...props} index={0} />}
          />
          {
            navItems.map((item, index) => (
              <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} render={props => <Leader refLink={match.url} {...props} leadership bacId={item.bacId} index={index || 0} />} />
            ))
          }
        </Switch>
      </div>
    );
  }
}
