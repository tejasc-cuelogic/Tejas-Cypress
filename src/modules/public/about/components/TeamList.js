import React, { Component } from 'react';
import { Grid, Reveal } from 'semantic-ui-react';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { Image64 } from '../../../../theme/shared';

@inject('teamStore')
class teamList extends Component {
  render() {
    const {
      columns, className, match,
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
        </Grid>
      </Grid.Column>
    );
  }
}

export default teamList;
