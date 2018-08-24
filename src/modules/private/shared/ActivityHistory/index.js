import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Grid, Form } from 'semantic-ui-react';
import { DropdownFilter } from '../../../../theme/form/Filters';
import AddActivity from './components/AddActivity';
import ActivityFeed from './components/ActivityFeed';

@inject('activityHistoryStore')
@observer
export default class ActivityHistory extends Component {
  componentWillMount() {
    this.props.activityHistoryStore.initRequest();
  }
  logActivity = () => this.props.activityHistoryStore.send();
  render() {
    const {
      ACTIVITY_FRM, msgEleChange, activities, loading,
    } = this.props.activityHistoryStore;
    return (
      <Aux>
        <div className="search-filters more inner-content-spacer">
          <Form>
            <Grid columns={4}>
              <Grid.Column>
                <DropdownFilter isMultiple value="" name="Activity Type" options={[]} />
              </Grid.Column>
              <Grid.Column>
                <DropdownFilter isMultiple value="" name="User Type" options={[]} />
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
