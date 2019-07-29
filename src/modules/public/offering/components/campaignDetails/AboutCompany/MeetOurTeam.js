import React, { Component } from 'react';
import { Header, Item, Icon } from 'semantic-ui-react';
import { filter } from 'lodash';
import { InlineLoader, Image64 } from '../../../../../../theme/shared';
import NSImage from '../../../../../shared/NSImage';
import HtmlEditor from '../../../../../shared/HtmlEditor';

const isMobile = document.documentElement.clientWidth < 992;

class MeetOurTeam extends Component {
  render() {
    const {
      campaign, emptyStatement,
    } = this.props;
    const leadershipArr = campaign && campaign.leadership && campaign.leadership.length
      ? campaign.leadership : [];
    const meetTeamOjb = filter(leadershipArr, o => (
      o.isPublic
    ));
    return (
      <>
        <Header as="h3" className={`${(this.props.newLayout && isMobile) ? 'mb-10' : this.props.newLayout ? 'mt-50 mb-30' : 'mt-20 mb-30'} anchor-wrap`}>
          Meet the Team
          <span className="anchor" id="team" />
        </Header>
        {meetTeamOjb.length
          ? (
            <>
              <Item.Group className="meet-team">
                {meetTeamOjb.map(data => (
                  data.isPublic
                  && (
<Item>
                    <Item.Content>
                      <div className={`campaign-avatar ${isMobile && 'mobile-avatar'}`}>
                        <div className="avatar-image team-avatar">
                          {data && data.uploads && data.uploads.headshot
                            && data.uploads.headshot.url ? (
                              <Image64 srcUrl={data.uploads.headshot.url} />
                            ) : (
                              <NSImage path="leader-placeholder.jpg" />
                            )
                          }
                        </div>
                        <div className="avatar-details team-details">
                          <Item.Header>{`${data.firstName || ''} ${data.lastName || ''}`}</Item.Header>
                          {data.companyPosition
                            && <Item.Meta className="text-uppercase"><b>{data.companyPosition}</b></Item.Meta>
                          }
                          {data && data.social
                            && (
<Item.Extra>
                              <div>
                                {data && data.social && Object.keys(data.social).map(key => (
                                  data.social[key]
                                    && (
<a href={data.social[key].includes('http') ? data.social[key] : `https://${data.social[key]}`} target="_blank" rel="noopener noreferrer" className="icon-link">
                                      <Icon color="green" name={key === 'website' ? 'globe in' : `${key} in`} />
                                    </a>
                                    )
                                ))}
                              </div>
                            </Item.Extra>
                            )
                          }
                        </div>
                      </div>
                      {data.bio
                        && (
<Item.Description className="avatar-description mt-30">
                          <HtmlEditor readOnly content={data.bio} />
                        </Item.Description>
                        )
                      }
                    </Item.Content>
                  </Item>
                  )
                ))}
              </Item.Group>
            </>
          )
          : <InlineLoader text={emptyStatement} className="bg-offwhite" />
        }
      </>
    );
  }
}

export default MeetOurTeam;
