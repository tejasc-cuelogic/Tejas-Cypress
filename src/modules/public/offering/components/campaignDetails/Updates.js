import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import moment from 'moment';
import Parser from 'html-react-parser';
import { Header, Item } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import 'react-vertical-timeline-component/style.min.css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { UserAvatar, InlineLoader } from '../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;
@inject('campaignStore')
@observer
class Updates extends Component {
  componentWillMount() {
    const { campaign } = this.props.campaignStore;
    const updates = campaign && campaign.updates ? campaign.updates : [];
    this.props.campaignStore.setInitialStateForReadMoreAndReadLess(updates);
  }
  handleClose = () => this.props.history.goBack();
  render() {
    const { campaign } = this.props.campaignStore;
    const updates = campaign && campaign.updates;
    const readMoreStatus = this.props.campaignStore.curretnStatusForReadMore;
    const readLessStatus = this.props.campaignStore.curretnStatusForReadLess;
    return (
      <div className="campaign-content-wrapper">
        <div className="updates-modal">
          {updates && updates.length ?
            <VerticalTimeline>
              {updates && updates.length &&
                updates.map((dataItem, index) => (
                  <VerticalTimelineElement
                    className={`vertical-timeline-element--work ${(index - 1) > 0 && updates[index - 1].updated.date !== dataItem.updated.date ? '' : 'hide-date'}`}
                    iconStyle={
                      (index === 0) && isMobile ?
                        {
                          background: '#20C86D', height: 25, width: 25, marginLeft: -14,
                        } : index === 0 ? {
                          background: '#20C86D', height: 42, width: 42, marginLeft: -22,
                        } : {}}
                    date={(index - 1) > 0 &&
                      updates[index - 1].updated.date !== dataItem.updated.date ?
                      moment(updates[index].updated.date).format('MMMM YYYY') : null}
                  >
                    <Item.Group>
                      <Item>
                        <div className="ui mini image">
                          <UserAvatar
                            UserInfo={dataItem.actingUserInfo && dataItem.actingUserInfo.info ? {
                              firstName: dataItem.actingUserInfo.info.firstName,
                              lastName: dataItem.actingUserInfo.info.lastName,
                              roles: ['investor'],
                              avatarUrl: dataItem.actingUserInfo.info.avatar ?
                                dataItem.actingUserInfo.info.avatar.url : null,
                            } : {
                                firstName: 'T',
                                lastName: 'T',
                                roles: ['investor'],
                                avatarUrl: null,
                              }}
                          />
                        </div>
                        <Item.Content verticalAlign="middle" >{dataItem.actingUserInfo && dataItem.actingUserInfo.info && dataItem.actingUserInfo.info.firstName} {dataItem.actingUserInfo && dataItem.actingUserInfo.info && dataItem.actingUserInfo.info.lastName} <br /><span className="highlight-text">{moment(dataItem.updated.date).format('LL')}</span></Item.Content>
                      </Item>
                      <Header as="h5">{dataItem.title}</Header>
                      <div
                        style={readMoreStatus[index] ? { display: 'block' } : { display: 'none' }}
                      >
                        <p>
                          {Parser(dataItem.content.length <= 805 ?
                            dataItem.content : dataItem.content.substring(1, 805))}
                        </p>
                        {dataItem.content.length > 805 ?
                          <a
                            href
                            onClick={
                              () => this.props.campaignStore.handleReadMoreReadLess(index)
                            }
                            id={index}
                          >
                            Read More
                          </a> : ''
                        }
                      </div>
                      <div
                        style={!readLessStatus[index] ? { display: 'block' } : { display: 'none' }}
                      >
                        <p>
                          {Parser(dataItem.content || '')}
                        </p>
                        <a
                          href
                          onClick={
                            () => this.props.campaignStore.handleReadMoreReadLess(index)
                          }
                          id={index}
                        >
                          Read Less
                        </a>
                      </div>
                    </Item.Group>
                  </VerticalTimelineElement>
                ))
              }
            </VerticalTimeline>
            :
            <div className="no-updates">
              <InlineLoader text="No Updates" />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Updates;
