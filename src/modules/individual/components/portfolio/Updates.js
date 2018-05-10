import React from 'react';
import { Route } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import UpdatesTimeline from './UpdatesComponents/UpdatesTimeline';
import UpdateDetails from './UpdatesComponents/UpdateDetails';

const summary = [
  {
    id: 4, date: 'Jan 23rd 2018',
  },
  {
    id: 3, date: 'Dec 17th 2017',
  },
  {
    id: 2, date: 'Aug 28th 2017',
  },
  {
    id: 1, date: 'Mar 01st 2017',
  },
];

const Updates = props => (
  <Grid padded="horizontally" relaxed="very">
    <Grid.Column width={4} className="update-list">
      <UpdatesTimeline match={props.match} heading="Recent" list={summary} />
    </Grid.Column>
    <Grid.Column width={1} only="computer" />
    <Grid.Column width={12} computer={10} className="update-details">
      <Route exact path={props.match.url} component={UpdateDetails} />
      <Route path={`${props.match.url}/:id`} component={UpdateDetails} />
    </Grid.Column>
  </Grid>
);

export default Updates;
