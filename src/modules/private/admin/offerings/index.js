/* eslint-disable */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { mapValues } from 'lodash';
import { Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../shared/PrivateLayout';
import Overview from './containers/Overview';
import AllOfferings from './containers/AllOfferings';
import NewOffer from './components/NewOffer';
import OfferingDetails from './containers/OfferingDetails';

@inject('uiStore', 'navStore', 'offeringsStore')
@observer
export default class Repayments extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/creation`);
    }
  }
  representAddon = subTabs => mapValues(subTabs, t => ` (${t})`);

  render() {
    const { match } = this.props;
    const { subTabs } = this.props.offeringsStore;
    // subNavAddon={{ data: this.representAddon(subTabs) }}
    return (
      <PrivateLayout
        {...this.props}
        subNav
      >
        <Switch>
          {/* <Route exact path={`${match.url}/overview`} component={Overview} /> */}
          <Route exact path={`${match.url}/:stage`} component={AllOfferings} />
          <Route exact path={`${match.url}/creation/new`} component={NewOffer} />
          <Route path={`${match.url}/:stage/edit/:offeringid`} render={props => <OfferingDetails refLink={match.url} {...props} />} />
        </Switch>
      </PrivateLayout>
    );
  }
}
