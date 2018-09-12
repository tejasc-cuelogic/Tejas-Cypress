import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { mapValues } from 'lodash';
import { Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../shared/PrivateLayout';
import Overview from './containers/Overview';
import AllOfferings from './containers/AllOfferings';
import OfferingDetails from './containers/OfferingDetails';

@inject('uiStore', 'navStore', 'offeringsStore')
@observer
export default class Repayments extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/overview`);
    }
  }
  representAddon = subTabs => mapValues(subTabs, t => ` (${t})`);

  render() {
    const { match } = this.props;
    const { subTabs } = this.props.offeringsStore;
    return (
      <PrivateLayout
        {...this.props}
        subNav
        subNavAddon={{ data: this.representAddon(subTabs) }}
      >
        <Switch>
          <Route exact path={`${match.url}/overview`} component={Overview} />
          <Route exact path={`${match.url}/:stage`} component={AllOfferings} />
          <Route path={`${match.url}/:stage/edit/:offeringid`} render={props => <OfferingDetails refLink={match.url} {...props} />} />
        </Switch>
      </PrivateLayout>
    );
  }
}
