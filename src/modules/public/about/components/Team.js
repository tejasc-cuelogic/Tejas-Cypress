import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Grid } from 'semantic-ui-react';
import TeamModal from '../components/TeamModal';
import { InlineLoader } from '../../../../theme/shared';
import TeamList from '../components/TeamList';

const isMobile = document.documentElement.clientWidth < 768;
@inject('teamStore')
@observer
class team extends Component {
  componentWillMount() {
    this.props.teamStore.initRequest();
  }
  render() {
    const { teamMembers, loading } = this.props.teamStore;
    const teamInfo = (
      <Grid doubling columns={2} className="team-list">
        <Grid.Column>
          <Grid centered>
            <Grid.Column largeScreen={8} computer={12} tablet={8} mobile={14} className={isMobile ? 'mt-30' : 'team-column'}>
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
        {loading ? (<InlineLoader />)
          : teamMembers.length === 0 ? <section className="center-align"><h3 style={{ color: '#31333d7d' }}>No Records to Display</h3></section>
            : teamInfo}
      </Aux>
    );
  }
}

export default team;
