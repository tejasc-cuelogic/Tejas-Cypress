import React, { Component } from 'react';
import { Header, Grid, Segment, Icon, Reveal, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import defaultLeaderProfile from '../../../../../../assets/images/leader-placeholder.jpg';

class MeetOurTeam extends Component {
  render() {
    const {
      campaign, meetOurTeamUrl, emptyStatement,
    } = this.props;
    return (
      <Grid.Column>
        <Segment padded>
          <Header as="h4">
            {campaign.leadership.length ?
              <Link to={`${meetOurTeamUrl}/meetourteam`}>
                Meet our team
                <Icon className="ns-chevron-right" color="green" />
              </Link>
              : <p>Meet our team</p>
            }
          </Header>
          {
            campaign.leadership.length ?
              <Grid columns={3}>
                {
                  campaign.leadership.map(data => (
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
              <p>{emptyStatement}</p>
          }
        </Segment>
      </Grid.Column>
    );
  }
}

export default MeetOurTeam;
