import React, { Component } from 'react';
import { Header, Grid, Segment, Icon, Reveal, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { filter } from 'lodash';
import { InlineLoader } from '../../../../../../theme/shared';
import defaultLeaderProfile from '../../../../../../assets/images/leader-placeholder.jpg';

class MeetOurTeam extends Component {
  render() {
    const {
      campaign, meetOurTeamUrl, emptyStatement,
    } = this.props;
    const leadershipArr = campaign && campaign.leadership && campaign.leadership.length ?
      campaign.leadership : [];
    const meetTeamOjb = filter(leadershipArr, o => (
      o.isPublic
    ));
    return (
      <Grid.Column>
        <Segment padded>
          <Header as="h4">
            {meetTeamOjb.length ?
              <Link to={`${meetOurTeamUrl}/meetourteam`}>
                Meet our team
                <Icon className="ns-chevron-right" color="green" />
              </Link>
              : <p>Meet our team</p>
            }
          </Header>
          {
            meetTeamOjb.length ?
              <Grid columns={3}>
                {
                  meetTeamOjb.map(data => (
                    data.isPublic ?
                      <Grid.Column>
                        <Reveal animated="small fade">
                          <Reveal.Content hidden>
                            <div className="team-overlay">
                              <p>{`${data.firstName} ${data.lastName}`}</p>
                            </div>
                          </Reveal.Content>
                          <Reveal.Content visible>
                            <Image
                              src={
                                data && data.uploads && data.uploads.headshot &&
                                  data.uploads.headshot.url ?
                                  data.uploads.headshot.url : defaultLeaderProfile
                              }
                              circular
                            />
                          </Reveal.Content>
                        </Reveal>
                      </Grid.Column>
                      :
                      ''
                  ))
                }
              </Grid>
              :
              <InlineLoader text={emptyStatement} />
          }
        </Segment>
      </Grid.Column>
    );
  }
}

export default MeetOurTeam;
