import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import UpdatesTimeline from './UpdatesComponents/UpdatesTimeline';
import UpdateDetails from './UpdatesComponents/UpdateDetails';
import { InlineLoader } from '../../../../../../theme/shared';
import { DataFormatter } from '../../../../../../helper';

@inject('updateStore')
@observer
class Updates extends Component {
  constructor(props) {
    super(props);
    this.props.updateStore.initRequest();
  }

  render() {
    const { updates, loading } = this.props.updateStore;
    const summary = [];
    if (updates && updates.length) {
      updates.map((dataItem, index) => {
        const dateObj = {};
        dateObj.id = index;
        dateObj.title = dataItem.title;
        dateObj.date = updates[index].updated.date
          ? DataFormatter.getDateAsPerTimeZone(updates[index].updated.date, true, true, false) : null;
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
