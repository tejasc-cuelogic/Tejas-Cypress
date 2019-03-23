import React, { Component } from 'react';
import moment from 'moment';
import { Header, Item } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import 'react-vertical-timeline-component/style.min.css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { Image64, InlineLoader } from '../../../../../theme/shared';
import HtmlEditor from '../../../../shared/HtmlEditor';

@inject('campaignStore')
@observer
class Updates extends Component {
  componentWillMount() {
    const { campaign } = this.props.campaignStore;
    const updates = campaign && campaign.updates ? campaign.updates : [];
    this.props.campaignStore.setInitialStateForReadMoreAndReadLess(updates);
  }
  componentDidMount() {
    const sel = 'anchor-scroll';
    document.querySelector(`.${sel}`).scrollIntoView(true);
  }
  handleClose = () => this.props.history.goBack();
  render() {
    const { campaign } = this.props.campaignStore;
    const updates = campaign && campaign.updates;
    const readMoreStatus = this.props.campaignStore.curretnStatusForReadMore;
    const readLessStatus = this.props.campaignStore.curretnStatusForReadLess;
    const companyAvatarUrl = campaign && campaign.media && campaign.media.avatar && campaign.media.avatar.url ? `${campaign.media.avatar.url}` : '';
    return (
      <div className="campaign-content-wrapper">
        <Header as="h3" className="mb-30 anchor-wrap">
          Updates
          <span className="anchor-scroll" />
        </Header>
        {updates && updates.length ?
          <VerticalTimeline className="campaign-updates" layout="one-column" animate={false}>
            {updates && updates.length &&
              updates.map((dataItem, index) => (
                <VerticalTimelineElement
                  position="right"
                  className={`vertical-timeline-element--work ${(index - 1) > 0 && updates[index - 1].updated.date !== dataItem.updated.date ? '' : 'hide-date'}`}
                  iconStyle={
                    index === 0 ? {
                      background: '#20C86D', height: 30, width: 30, marginLeft: -15,
                    } : {}}
                  date={(index - 1) > 0 ?
                    updates[index - 1].updated.date !== dataItem.updated.date ?
                      moment(updates[index].updated.date).format('MMMM YYYY') : null : null}
                >
                  <Item.Group>
                    <Item>
                      <div className="ui image">
                        {companyAvatarUrl && companyAvatarUrl.length ?
                          <div className="avatar-image">
                            <Image64 size="mini" srcUrl={companyAvatarUrl} />
                          </div> : null
                        }
                      </div>
                      <Item.Content verticalAlign="middle" className="grey-header" >{dataItem.actingUserInfo && dataItem.actingUserInfo.info && dataItem.actingUserInfo.info.firstName} {dataItem.actingUserInfo && dataItem.actingUserInfo.info && dataItem.actingUserInfo.info.lastName} <br /><span>{moment(dataItem.updated.date).format('ll')}</span></Item.Content>
                    </Item>
                    <Header as="h4">{dataItem.title}</Header>
                    <div
                      style={readMoreStatus[index] ? { display: 'block' } : { display: 'none' }}
                    >
                      <HtmlEditor
                        readOnly
                        content={dataItem.content.length <= 805 ?
                          dataItem.content : dataItem.content.substring(0, 805)}
                      />
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
                      <HtmlEditor readOnly content={dataItem.content || ''} />
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
          <InlineLoader text="No Updates" className="bg-offwhite" />
        }
      </div>
    );
  }
}

export default Updates;
