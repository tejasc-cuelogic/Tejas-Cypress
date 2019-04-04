import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import moment from 'moment';
import { Grid, Form } from 'semantic-ui-react';
import { DropdownFilter, DateRangeFilter } from '../../../../theme/form/Filters';
import { FILTER_META } from '../../../../constants/user';
import AddActivity from './components/AddActivity';
import ActivityFeed from './components/ActivityFeed';

@inject('activityHistoryStore')
@observer
export default class ActivityHistory extends Component {
  componentWillMount() {
    this.props.activityHistoryStore.initRequest(this.props.resourceId);
  }
  componentWillUnmount() {
    this.props.activityHistoryStore.setFieldValue('activityTypes', []);
    this.props.activityHistoryStore.setFieldValue('requestState', { filters: {} });
  }
  setSearchParam = (e, { name, value }) =>
    this.props.activityHistoryStore.setInitiateSrch(name, value, this.props.resourceId);
  logActivity = () => this.props.activityHistoryStore.send(this.props.resourceId);
  change = (date, field) => {
    if (date && moment(date.formattedValue, 'MM-DD-YYYY', true).isValid()) {
      this.props.activityHistoryStore.setInitiateSrch(field, date, this.props.resourceId);
    }
  }
  render() {
    const {
      ACTIVITY_FRM, msgEleChange, activities, loading, requestState, activityTypes,
    } = this.props.activityHistoryStore;
    const { showFilters } = this.props;
    return (
      <Aux>
        <div className="search-filters more inner-content-spacer">
          <Form>
            <Grid columns={4}>
              {showFilters && showFilters.includes('activityType') && activityTypes.length > 1 &&
                <Grid.Column>
                  <DropdownFilter value={requestState.filters.activityType} keyName="activityType" change={this.setSearchParam} name="Activity Type" options={activityTypes} />
                </Grid.Column>
              }
              {showFilters && showFilters.includes('activityUserType') &&
                <Grid.Column>
                  <DropdownFilter value={requestState.filters.activityUserType} keyName="activityUserType" change={this.setSearchParam} name="User Type" options={FILTER_META.activityUserType.filter(i => !i.applicable || i.applicable.length === 0 || i.applicable.includes(this.props.module))} />
                </Grid.Column>
              }
              {showFilters && showFilters.includes('ActivityDate') &&
                <Grid.Column>
                  <DateRangeFilter filters={requestState.search} label="Activity Date" change={this.change} />
                </Grid.Column>
              }
              {showFilters && showFilters.includes('subType') &&
                <Grid.Column>
                  <DropdownFilter value={requestState.filters.subType} keyName="subType" change={this.setSearchParam} name="Sub Type" options={FILTER_META.subType} />
                </Grid.Column>
              }
            </Grid>
          </Form>
        </div>
        <AddActivity submit={this.logActivity} form={ACTIVITY_FRM} change={msgEleChange} />
        <ActivityFeed loading={loading} activities={activities} change={msgEleChange} />
      </Aux>
    );
  }
}
