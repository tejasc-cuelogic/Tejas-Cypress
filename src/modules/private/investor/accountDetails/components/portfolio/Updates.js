import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import UpdatesTimeline from './UpdatesComponents/UpdatesTimeline';
import UpdateDetails from './UpdatesComponents/UpdateDetails';

// const summary = [
//   { id: 4, date: 'Jan 23rd 2018' },
//   { id: 3, date: 'Dec 17th 2017' },
//   { id: 2, date: 'Aug 28th 2017' },
//   { id: 1, date: 'Mar 01st 2017' },
// ];
@inject('campaignStore')
@observer
class Updates extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    const updates = campaign && campaign.updates;
    const summary = [];
    if (updates && updates.length) {
      updates.map((dataItem, index) => {
        const dateObj = {};
        dateObj.id = index;
        dateObj.date = updates[index].updated.date ?
          moment(updates[index].updated.date).format('ll') : null;
        return summary.push(dateObj);
      });
      console.log('summary', summary);
    }
    return (
      <Grid padded relaxed="very">
        <Grid.Column width={4} className="update-list">
          <UpdatesTimeline match={this.props.match} heading="Recent" list={summary} />
        </Grid.Column>
        <Grid.Column width={1} only="computer" />
        <Grid.Column width={12} computer={10} className="update-details">
          <Route exact path={this.props.match.url} component={UpdateDetails} />
          <Route path={`${this.props.match.url}/:id`} component={UpdateDetails} />
        </Grid.Column>
      </Grid>
    );
  }
}

export default Updates;
