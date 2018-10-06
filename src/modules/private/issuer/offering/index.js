import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../shared/PrivateLayout';
import OfferingModule from '../../shared/offerings/components';
import { DataFormatter } from '../../../../helper';
import { InlineLoader } from '../../../../theme/shared';

@inject('uiStore', 'navStore', 'offeringsStore')
@observer
export default class Offering extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/overview`);
    }
    this.props.offeringsStore.getOne(this.props.match.params.id);
    this.props.navStore.setAccessParams('specificNav', '/app/offering/2/overview');
  }
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { match, offeringsStore } = this.props;
    const navItems = this.props.navStore.navMeta.subNavigations;
    const { offer, offerLoading } = offeringsStore;
    if (offerLoading || (offer && !offer.keyTerms)) {
      return <InlineLoader />;
    }
    return (
      <PrivateLayout {...this.props}>
        <Switch>
          <Route exact path={match.url} component={OfferingModule('overview')} />
          {
            navItems.map(item => (
              <Route
                key={item.to}
                path={`${match.url}/${item.to}`}
                component={OfferingModule(item.to)}
              />
            ))
          }
        </Switch>
      </PrivateLayout>
    );
  }
}
