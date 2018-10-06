import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route } from 'react-router-dom';
import SecondaryMenu from '../../../../../../../theme/layout/SecondaryMenu';
import AfIssuer from './AfIssuer';

@inject('offeringCreationStore', 'userStore')
@observer
export default class AffiliatedIssuer extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/1`);
    }
    const {
      getAffiliatedIssuerOfferingBac,
      currentOfferingId,
      initLoad,
    } = this.props.offeringCreationStore;
    if (!initLoad.includes('AFFILIATED_ISSUER_FRM')) {
      getAffiliatedIssuerOfferingBac(currentOfferingId, 'AFFILIATED_ISSUER');
    }
  }
  render() {
    const { AFFILIATED_ISSUER_FRM } = this.props.offeringCreationStore;
    const navItems = [];
    AFFILIATED_ISSUER_FRM.fields.getOfferingBac.map((issuer, index) => {
      navItems.push({ title: `Affiliated Issuer ${index + 1}`, to: `${index + 1}` });
      return navItems;
    });
    const { match } = this.props;
    const { isIssuer } = this.props.userStore;
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? '' : 'ui card fluid'}>
        <SecondaryMenu className={!isIssuer ? 'tertiary' : ''} match={match} navItems={navItems} />
        <Switch>
          <Route
            exact
            path={match.url}
            render={props =>
              <AfIssuer refLink={match.url} {...props} index={0} />}
          />
          {
            navItems.map((item, index) => (
              <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} render={props => <AfIssuer refLink={match.url} {...props} index={index || 0} />} />
            ))
          }
        </Switch>
      </div>
    );
  }
}
