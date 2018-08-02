import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link, Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import LazyLoad from 'react-lazyload';
import { Header, Grid, Reveal, Image, Icon } from 'semantic-ui-react';
import TeamModal from '../components/TeamModal';

@inject('teamStore')
@observer
class team extends Component {
  componentWillMount() {
    this.props.teamStore.initRequest();
  }
  render() {
    const { teamMembers } = this.props.teamStore;
    const load = <h1>Loading...</h1>;
    const teamInfo = (<Grid stackable columns={2}>
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
      <Grid.Column>
        <Grid columns={3} className="team-gallery">
          { teamMembers.map(member => (
            <Grid.Column>
              <Reveal as={Link} to={`${this.props.match.url}/${member.id}`} animated="fade">
                <Reveal.Content hidden>
                  <div className="team-overlay">
                    <p><b>{member.memberName}</b></p>
                    <p>{member.title}</p>
                  </div>
                </Reveal.Content>
                <Reveal.Content visible>
                  <LazyLoad height={100} >
                    <Image src={member.avatar} />
                  </LazyLoad>
                </Reveal.Content>
              </Reveal>
            </Grid.Column>
       ))}
          <Grid.Column>
            <Reveal animated="fade">
              <div className="team-overlay">
                <Header as="h4" textAlign="center">
                  Join our team
                  <Header.Subheader as={Link} to="/">
                    <Icon color="green" className="ns-arrow-right" />
                    See open positions
                  </Header.Subheader>
                </Header>
              </div>
            </Reveal>
          </Grid.Column>
        </Grid>
      </Grid.Column>
      <Route
        path={`${this.props.match.url}/:id`}
        render={
          props => <TeamModal refLink={this.props.match.url} {...props} />
        }
      />
                      </Grid>);// eslint-disable-line react/jsx-indent
    return (
      <Aux>
        {teamMembers.length === 0 ? load : teamInfo}
      </Aux>
    );
  }
}

export default team;
