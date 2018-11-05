import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Grid, Form } from 'semantic-ui-react';
import { DropdownFilter } from '../../../../theme/form/Filters';
import { FILTER_META } from '../../../../constants/user';
import AddActivity from './components/AddActivity';
import ActivityFeed from './components/ActivityFeed';

@inject('activityHistoryStore')
@observer
export default class ActivityHistory extends Component {
  componentWillMount() {
    this.props.activityHistoryStore.initRequest(this.props.resourceId);
  }
  setSearchParam = (e, { name, value }) =>
    this.props.activityHistoryStore.setInitiateSrch(name, value, this.props.resourceId);
  logActivity = () => this.props.activityHistoryStore.send(this.props.resourceId);
  render() {
    const {
      ACTIVITY_FRM, msgEleChange, activities, loading, requestState,
    } = this.props.activityHistoryStore;
    return (
      <Aux>
        <div className="search-filters more inner-content-spacer">
          <Form>
            <Grid columns={4}>
              <Grid.Column>
                <DropdownFilter value={requestState.filters.activityType} keyName="activityType" change={this.setSearchParam} name="Activity Type" options={FILTER_META.activityType} isMultiple />
              </Grid.Column>
              <Grid.Column>
                <DropdownFilter value={requestState.filters.activityUserType} keyName="activityUserType" change={this.setSearchParam} name="User Type" options={FILTER_META.activityUserType} isMultiple />
              </Grid.Column>
            </Grid>
          </Form>
        </div>
        <AddActivity submit={this.logActivity} form={ACTIVITY_FRM} change={msgEleChange} />
        <ActivityFeed loading={loading} activities={activities} change={msgEleChange} />
      </Aux>
    );
  }
}
