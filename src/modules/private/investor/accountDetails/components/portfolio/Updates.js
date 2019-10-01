import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import UpdatesTimeline from './UpdatesComponents/UpdatesTimeline';
import UpdateDetails from './UpdatesComponents/UpdateDetails';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('updateStore')
@observer
class Updates extends Component {
  constructor(props) {
    super(props);
    if (!this.props.updateStore.isApiHit) {
      this.props.updateStore.initRequest();
    }
  }

  render() {
    const { updates, loading } = this.props.updateStore;
    const summary = [];
    const filteredUpdates = (updates && updates.length) ? updates.filter(d => d.isVisible) : [];
    if (filteredUpdates && filteredUpdates.length) {
      filteredUpdates.map((dataItem, index) => {
        const dateObj = {};
        dateObj.id = index;
        dateObj.title = dataItem.title;
        dateObj.date = filteredUpdates[index].updatedDate
          ? moment(filteredUpdates[index].updatedDate).format('LL') : null;
        return summary.push(dateObj);
      });
    }
    if (loading) {
      return <InlineLoader />;
    }
    return (
      <Grid padded relaxed="very">
        <Grid.Column width={4} className="update-list">
          <UpdatesTimeline match={this.props.match} heading="Recent" list={summary} />
        </Grid.Column>
        <Grid.Column width={1} only="computer" />
        <Grid.Column width={12} computer={10} className="update-details">
          <Route
            exact
            path={this.props.match.url}
            // component={UpdateDetails}
            render={props => <UpdateDetails {...props} />}
          />
          <Route
            path={`${this.props.match.url}/:id`}
            render={props => <UpdateDetails {...props} />}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

export default Updates;
