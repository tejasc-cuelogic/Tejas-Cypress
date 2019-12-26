import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { SuspenseBoundary, lazyRetry, InlineLoader } from '../../../../../theme/shared';
import { DataFormatter } from '../../../../../helper';
import ActivityHistory from '../../ActivityHistory';
import { BUSINESS_APPLICATION_STATUS } from '../../../../../services/constants/businessApplication';
import { ACTIVITY_HISTORY_TYPES } from '../../../../../constants/common';

const getModule = component => lazyRetry(() => import(`../../../admin/applications/components/details/${component}`));

@withRouter
@inject('offeringsStore', 'navStore', 'userStore', 'businessAppStore')
@observer
export default class ApplicationDetails extends Component {
  constructor(props) {
    super(props);
    const { match, applicationId, issuerId } = this.props;
    if (this.props.businessAppStore.applicationId !== applicationId) {
      this.props.businessAppStore.fetchAdminApplicationById(applicationId, 'completed', issuerId)
        .then(() => {
          if (match.isExact) {
            this.props.history.push(`${match.url}/activity-history`);
          }
        });
    }
  }

  module = name => DataFormatter.upperCamelCase(name);

  render() {
    const { match, businessAppStore, applicationId } = this.props;
    const { isIssuer } = this.props.userStore;
    const {
      businessApplicationDetailsAdmin,
    } = businessAppStore;
    if (!businessApplicationDetailsAdmin) {
      return <InlineLoader />;
    }
    const {
      applicationStatus, prequalStatus, userId,
    } = businessApplicationDetailsAdmin; // deleted, stashed,
    let navItems = [
      { title: 'Activity History', to: 'activity-history', component: ActivityHistory },
      { title: 'Pre-qualification', to: 'pre-qualification' },
    ];
    if ((applicationStatus || prequalStatus)
      !== BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED) {
      navItems = [
        ...navItems,
        { title: 'Business Details', to: 'business-details' },
        { title: 'Performance', to: 'performance' },
        { title: 'Documentation', to: 'documentation' },
        { title: 'Review', to: 'review' },
      ];
    }
    // if (!deleted && !stashed && match.params.id === 'completed') {
    //   navItems = [
    //     ...navItems,
    //     { title: 'Review', to: 'review' },
    //   ];
    // }
    const appStepStatus = (applicationStatus || prequalStatus) === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED ? 'Failed' : (applicationStatus || prequalStatus) === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED ? 'In-Progress' : 'Completed';
    return (
      <div className={isIssuer ? 'ui card fluid' : ''}>
        <SecondaryMenu force2ary={!isIssuer} match={match} navItems={navItems} />
        <SuspenseBoundary>
        <Switch>
          <Route
            exact
            path={match.url}
            component={navItems[0].component || getModule(this.module(navItems[0].title))}
          />
          {
            navItems.map((item) => {
              const { params } = match;
              const CurrentComponent = (item.component || getModule(this.module(item.title)));
              return (
                <Route
                  key={item.to}
                  path={`${match.url}/${item.to}`}
                  render={props => (
                    <CurrentComponent
                      module={item.title === 'Activity History' ? 'applicationDetails' : false}
                      showFilters={item.title === 'Activity History' ? ['activityType', 'activityUserType'] : false}
                      resourceId={applicationId}
                      applicationId={applicationId}
                      applicationIssuerId={userId}
                      stepName={appStepStatus !== 'Failed' ? 'APPN_ACTIVITY_HISTORY' : ''}
                      appType={params.id}
                      activityTitle="Comment"
                      activityType={ACTIVITY_HISTORY_TYPES.COMMENT}
                      {...props}
                      classes={item.title === 'Activity History' ? 'application-activity' : ''}
                    />
                  )
                  }
                />
              );
            })
          }
        </Switch>
        </SuspenseBoundary>
      </div>
    );
  }
}
