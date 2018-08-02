import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Grid } from 'semantic-ui-react';
import TeamModal from '../components/TeamModal';
import TeamList from '../components/TeamList';


@inject('teamStore')
@observer
class team extends Component {
  componentWillMount() {
    this.props.teamStore.initRequest();
  }
  render() {
    const { teamMembers, loading } = this.props.teamStore;
    const teamInfo = (
      <Grid stackable columns={2}>
        <Grid.Column>
          <Grid centered>
            <Grid.Column width={8} className="team-column">
              <Header as="h2">Meet our team.</Header>
              <p>
              We&apos;re a team of entrepreneurs with backgrounds in business, finance,
              law, marketing and technology. We&apos;re here to empower business owners
              and everyday people to invest in one another.
              </p>
            </Grid.Column>
          </Grid>
        </Grid.Column>
        <TeamList
          columns={3}
          className="team-gallery"
          match={this.props.match}
          members={teamMembers}
          joinColumn
        />
        <Route
          path={`${this.props.match.url}/:id`}
          render={
            props => <TeamModal refLink={this.props.match.url} {...props} />
          }
        />
      </Grid>);
    return (
      <Aux>
        {loading ? (<h2>Loading...</h2>)
        : teamMembers.length === 0 ? <h2>No Records to Display</h2>
        : teamInfo}
      </Aux>
    );
  }
}

export default team;
