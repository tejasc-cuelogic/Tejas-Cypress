import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Item, Image, Icon } from 'semantic-ui-react';
// import { Link } from 'react-router-dom';
import { filter } from 'lodash';
import { InlineLoader, Image64 } from '../../../../../../theme/shared';
import { ASSETS_URL } from '../../../../../../constants/aws';

class MeetOurTeam extends Component {
  render() {
    const {
      campaign, emptyStatement,
    } = this.props;
    const leadershipArr = campaign && campaign.leadership && campaign.leadership.length ?
      campaign.leadership : [];
    const meetTeamOjb = filter(leadershipArr, o => (
      o.isPublic
    ));
    return (
      <Aux>
        <Header as="h3" id="team">Meet the Team</Header>
        {
          meetTeamOjb.length ?
            <Aux>
              <Item.Group className="meet-team">
                {
                  meetTeamOjb.map(data => (
                    data.isPublic &&
                      <Item>
                        <Item.Content>
                          <div className="campaign-avatar">
                            <div className="avatar-image team-avatar">
                              {data && data.uploads && data.uploads.headshot &&
                                data.uploads.headshot.url ? (
                                  <Image64 srcUrl={data.uploads.headshot.url} />
                                ) : (
                                  <Image src={`${ASSETS_URL}images/leader-placeholder.jpg`} />
                                )
                              }
                            </div>
                            <div className="avatar-details team-details">
                              <Item.Header>{`${data.firstName} ${data.lastName}`}</Item.Header>
                              <Item.Meta className="text-uppercase"><b>{data.companyPosition}</b></Item.Meta>
                              <Item.Extra>
                                <div>
                                  {data && data.social &&
                                    Object.keys(data.social).map(key => (
                                      <a href={`https://${data.social[key]}`} target="_blank" rel="noopener noreferrer" className="icon-link">
                                        <Icon color="green" name={key === 'website' ? 'globe in' : `${key} in`} />
                                      </a>
                                    ))
                                  }
                                </div>
                              </Item.Extra>
                            </div>
                          </div>
                          <Item.Description className="avatar-description mt-30">
                            {data.bio && data.bio !== '' ? data.bio : emptyStatement}
                          </Item.Description>
                        </Item.Content>
                      </Item>
                  ))
                }
              </Item.Group>
            </Aux>
            :
            <InlineLoader text={emptyStatement} />
        }
      </Aux>
    );
  }
}

export default MeetOurTeam;
