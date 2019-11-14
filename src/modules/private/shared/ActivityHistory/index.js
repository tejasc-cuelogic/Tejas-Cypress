import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { Grid, Form } from 'semantic-ui-react';
import { DropdownFilter, DateRangeFilter } from '../../../../theme/form/Filters';
import formHOC from '../../../../theme/form/formHOC';
import { FILTER_META } from '../../../../constants/user';
import AddActivity from './components/AddActivity';
import ActivityFeed from './components/ActivityFeed';

const metaInfo = {
  store: 'activityHistoryStore',
  form: 'ACTIVITY_FRM',
};

@inject('activityHistoryStore')
@observer
class ActivityHistory extends Component {
  state = { defaultFilter: true }

  componentDidMount() {
    if (this.props.resourceId) {
      this.props.activityHistoryStore.initRequest(this.props.resourceId, this.state.defaultFilter);
    }
    this.setState({ defaultFilter: false });
  }

  componentWillUnmount() {
    this.props.activityHistoryStore.setFieldValue('activityTypes', []);
    this.props.activityHistoryStore.setFieldValue('requestState', { filters: {} });
    this.props.activityHistoryStore.resetForm('ACTIVITY_FRM');
  }

  setSearchParam = (e, { name, value }) => this.props.activityHistoryStore.setInitiateSrch(name, value, this.props.resourceId);

  logActivity = () => this.props.activityHistoryStore.send(this.props.resourceId, this.props.activityTitle, this.props.activityType);

  change = (date, field) => {
    if ((date && moment(date.formattedValue, 'MM-DD-YYYY', true).isValid()) || !date.formattedValue) {
      this.props.activityHistoryStore.setInitiateSrch(field, date, this.props.resourceId);
    }
  }

  render() {
    const {
      ACTIVITY_FRM, activities, loader, requestState, activityTypes,
    } = this.props.activityHistoryStore;
    const { showFilters, adminActivity, smartElement } = this.props;
    return (
      <div className={adminActivity ? 'activity-component' : ''}>
        <div className="search-filters more inner-content-spacer">
          <Form>
            <Grid columns={4}>
              {showFilters && showFilters.includes('activityType') && activityTypes.length > 1
                && (
                  <Grid.Column>
                    <DropdownFilter value={requestState.filters.activityType} keyName="activityType" change={this.setSearchParam} name="Activity Type" options={activityTypes} />
                  </Grid.Column>
                )
              }
              {showFilters && showFilters.includes('activityUserType')
                && (
                  <Grid.Column>
                    <DropdownFilter value={requestState.filters.activityUserType} keyName="activityUserType" change={this.setSearchParam} name="User Type" options={FILTER_META.activityUserType.filter(i => !i.applicable || i.applicable.length === 0 || i.applicable.includes(this.props.module))} />
                  </Grid.Column>
                )
              }
              {showFilters && showFilters.includes('ActivityDate')
                && (
                  <Grid.Column>
                    <DateRangeFilter startDate={requestState.filters.startDate ? moment(requestState.filters.startDate).subtract(1, 'day').format('MM-DD-YYYY') : ''} endDate={requestState.filters.endDate ? moment(requestState.filters.endDate).subtract(1, 'day').format('MM-DD-YYYY') : ''} label="Activity Date" change={this.change} />
                  </Grid.Column>
                )
              }
              {showFilters && showFilters.includes('subType')
                && (
                  <Grid.Column>
                    <DropdownFilter value={requestState.filters.subType} keyName="subType" change={this.setSearchParam} name="Sub Type" options={FILTER_META.subType} />
                  </Grid.Column>
                )
              }
            </Grid>
          </Form>
        </div>
        <AddActivity submit={this.logActivity} form={ACTIVITY_FRM} smartElement={smartElement} />
        <ActivityFeed loading={loader} activities={activities} />
      </div>
    );
  }
}

export default formHOC(ActivityHistory, metaInfo);
