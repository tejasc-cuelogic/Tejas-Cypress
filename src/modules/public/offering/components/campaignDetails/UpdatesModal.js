import React, { Component } from 'react';
import moment from 'moment';
import { Header, Modal, Label, Item } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import 'react-vertical-timeline-component/style.min.css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { UserAvatar } from '../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;
@inject('campaignStore')
@observer
class MeetTeamModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    const { campaign } = this.props.campaignStore;
    const updates = campaign && campaign.updates;
    return (
      <Modal
        open
        size="large"
        onClose={this.handleClose}
        closeIcon
      >
        <Header as="h3">
          Updates
          <Label circular color="blue" key="blue">{(updates && updates.length) || 0}</Label>
        </Header>
        <Modal.Content scrolling className="updates-modal">
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
                            UserInfo={{
                            firstName: dataItem.actingUserInfo.info.firstName,
                            lastName: dataItem.actingUserInfo.info.lastName,
                            roles: ['investor'],
                            avatarUrl: dataItem.actingUserInfo.info.avatar ?
                            dataItem.actingUserInfo.info.avatar.url : null,
                            }}
                          />
                        </div>
                        <Item.Content verticalAlign="middle" >{dataItem.actingUserInfo.info.firstName} {dataItem.actingUserInfo.info.lastName} <br /><span className="highlight-text">{moment(dataItem.updated.date).format('LL')}</span></Item.Content>
                      </Item>
                      <Header as="h5">{dataItem.title}</Header>
                      <p dangerouslySetInnerHTML={{ __html: dataItem.content }} />
                    </Item.Group>
                  </VerticalTimelineElement>
                ))
              }
          </VerticalTimeline>
        </Modal.Content>
      </Modal>
    );
  }
}

export default MeetTeamModal;
