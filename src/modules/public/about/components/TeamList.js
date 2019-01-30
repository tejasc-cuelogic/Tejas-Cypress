import React, { Component } from 'react';
import { Header, Icon, Grid, Reveal } from 'semantic-ui-react';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { Image64 } from '../../../../theme/shared';

@inject('teamStore')
class teamList extends Component {
  render() {
    const {
      columns, className, match, joinColumn,
    } = this.props;
    const { teamMembers } = this.props.teamStore;
    return (
      <Grid.Column>
        <Grid columns={columns} className={className} doubling>
          { teamMembers.map(member => (
            <Grid.Column>
              <Reveal as={Link} to={`${match.url}/${member.id}`} animated="fade">
                <Reveal.Content hidden>
                  <div className="team-overlay">
                    <p><b>{member.memberName}</b></p>
                    <p>{member.title}</p>
                  </div>
                </Reveal.Content>
                <Reveal.Content visible>
                  <LazyLoad height={100} >
                    <Image64 srcUrl={member.avatar} alt={member.memberName} />
                  </LazyLoad>
                </Reveal.Content>
              </Reveal>
            </Grid.Column>))}
          { joinColumn &&
          <Grid.Column verticalAlign="middle" className={`${(teamMembers.length % 2 === 0) && 'centered'}`}>
            <Link to="/about/careers">
              <Header as="h4" textAlign="center">
                Join our team
                <Header.Subheader className="mt-10">
                  See open positions
                  <Icon color="green" className="ns-arrow-right right" />
                </Header.Subheader>
              </Header>
            </Link>
          </Grid.Column> }
        </Grid>
      </Grid.Column>
    );
  }
}

export default teamList;

