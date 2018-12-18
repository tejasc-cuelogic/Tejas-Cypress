import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Grid, Segment, Icon, Reveal } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { filter } from 'lodash';
import { InlineLoader, Image64 } from '../../../../../../theme/shared';
// import { ASSETS_URL } from '../../../../../../constants/aws';

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
                Meet Our Team
                <Icon className="ns-chevron-right" color="green" />
              </Link>
              :
              <Aux>
                Meet Our Team
                <Icon className="ns-chevron-right" color="green" />
              </Aux>
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
                          <Reveal.Content hidden as={Link} to={`${meetOurTeamUrl}/meetourteam`}>
                            <div className="team-overlay">
                              <p>{`${data.firstName} ${data.lastName}`}</p>
                            </div>
                          </Reveal.Content>
                          <Reveal.Content visible>
                            {/* <Image64
                              srcUrl={MEDIA_FRM.fields.heroImage.preSignedUrl}
                            /> */}
                            <Image64
                              srcUrl={
                                data && data.uploads && data.uploads.headshot &&
                                  data.uploads.headshot.url ?
                                  data.uploads.headshot.url : null
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
