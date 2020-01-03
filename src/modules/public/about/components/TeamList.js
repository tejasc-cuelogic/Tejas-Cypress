import React, { Component } from 'react';
import { Header, Grid, Reveal } from 'semantic-ui-react';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import scrollIntoView from 'scroll-into-view';
import LazyLoad from 'react-lazyload';
import { Image64 } from '../../../../theme/shared';

@inject('teamStore')
class teamList extends Component {
  handleScroll = () => {
    scrollIntoView(document.querySelector('#job-position'), { align: { top: 0, topOffset: 70 } });
  }

  render() {
    const {
      columns, className, match, joinColumn, hasJob,
    } = this.props;
    const { teamMembers } = this.props.teamStore;
    return (
      <Grid.Column>
        <Grid columns={columns} className={className} doubling>
          {teamMembers.map(member => member.isPublished && (
            <Grid.Column>
              <Reveal as={Link} to={`${match.url}/${member.id}`} animated="fade">
                <Reveal.Content hidden>
                  <div className="team-overlay">
                    <p><b>{member.memberName}</b></p>
                    <p>{member.title}</p>
                  </div>
                </Reveal.Content>
                <Reveal.Content visible>
                  <LazyLoad height={100}>
                    <Image64 avatarPlaceholder srcUrl={member.avatar} alt={member.memberName} />
                  </LazyLoad>
                </Reveal.Content>
              </Reveal>
            </Grid.Column>
          ))}
          {joinColumn
            && (
              <Grid.Column verticalAlign="middle" className={`${(teamMembers.length % 2 === 0) && 'centered'}`}>
                <Header onClick={this.handleScroll} as="h4" textAlign="center">
                  Join our team
                  <Header.Subheader className={`mt-10 ${hasJob ? 'highlight-text' : ''}`}>
                    {hasJob ? 'See open positions' : 'No open positions at this time'}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            )}
        </Grid>
      </Grid.Column>
    );
  }
}

export default teamList;
