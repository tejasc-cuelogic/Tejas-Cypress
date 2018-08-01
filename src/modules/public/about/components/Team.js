import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link, Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
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
    return (
      <Aux>
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
                      <Image src={member.avatar} />
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
          { teamMembers.map(member => (
            <Route
              path={`${this.props.match.url}/${member.id}`}
              render={
                props => <TeamModal refLink={this.props.match.url} {...props} member={member} />
              }
            />
        ))}
        </Grid>
      </Aux>
    );
  }
}

export default team;
