/* eslint-disable */
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Loadable from 'react-loadable';
import { mapValues } from 'lodash';
import PrivateLayout from '../../../shared/PrivateHOC';
import StatusChangeAppModal from '../components/StatusChangeAppModal';
import { InlineLoader } from '../../../../../theme/shared';
import ApplicationDetails from './ApplicationDetails';

const getModule = component => Loadable({
  loader: () => import(`../components/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

@inject('businessAppAdminStore')
@observer
export default class ManageApplications extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/prequal-failed`);
    }
    this.props.businessAppAdminStore.getBusinessApplicationSummary();
  }

  representAddon = summary => mapValues(summary, s => ` (${s})`);

  search = (e) => {
    if (e.charCode === 13) {
      // search goes here..
    }
  }
  render() {
    const { match, businessAppAdminStore } = this.props;
    const { summary } = businessAppAdminStore;
    // subNavAddon={{ data: this.representAddon(summary) }}
    return (
      <PrivateLayout
        {...this.props}
        subNav
      >
        <Switch>
          <Route path={`${match.url}/:id/view/:appId/:userId`} render={props => <ApplicationDetails refLink={match.url} {...props} />} />
          <Route exact path={`${match.url}/:applicationType`} component={getModule('ApplicationsList')} />
          <Route exact path={`${match.url}/:id/:appId/:userId/:appStatus/:action/confirm`} component={StatusChangeAppModal} />
        </Switch>
      </PrivateLayout>
    );
  }
}
