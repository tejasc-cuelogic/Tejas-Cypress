import React, { Component } from 'react';
import moment from 'moment';
import { get, orderBy } from 'lodash';
import { Header, Item } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import 'react-vertical-timeline-component/style.min.css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { Image64, InlineLoader, UserAvatar } from '../../../../../theme/shared';
import HtmlEditor from '../../../../shared/HtmlEditor';

const isMobile = document.documentElement.clientWidth < 992;

@inject('campaignStore')
@observer
class Updates extends Component {
  componentWillMount() {
    const { campaign } = this.props.campaignStore;
    const updates = campaign && campaign.updates ? campaign.updates : [];
    this.props.campaignStore.setInitialStateForReadMoreAndReadLess(updates);
  }

  componentDidMount() {
    const { newLayout } = this.props;
    if (!isMobile && !newLayout) {
      const sel = 'anchor';
      document.querySelector(`.${sel}`).scrollIntoView(true);
    }
  }

  handleClose = () => this.props.history.goBack();

  render() {
    const { newLayout } = this.props;
    const { campaign } = this.props.campaignStore;
    let updates = campaign && campaign.updates;
    updates = orderBy(updates, ['updated.date'], 'desc');
    const readMoreStatus = this.props.campaignStore.curretnStatusForReadMore;
    const readLessStatus = this.props.campaignStore.curretnStatusForReadLess;
    const companyAvatarUrl = campaign && campaign.media && campaign.media.avatar && campaign.media.avatar.url ? `${campaign.media.avatar.url}` : '';
    // const issuerId = campaign && campaign.issuerId;
    return (
      <div className={newLayout ? '' : 'campaign-content-wrapper'}>
        <Header as="h3" className={`${newLayout && isMobile ? 'mt-40' : newLayout ? 'mt-40' : 'mt-20'} ${isMobile ? 'mb-20' : 'mb-30'} anchor-wrap`}>
          Updates
          <span className="anchor" id={newLayout ? 'updates' : ''} />
        </Header>
        {updates && updates.length
          ? (
          <VerticalTimeline className="campaign-updates" layout="one-column" animate={false}>
            {updates && updates.length
              && updates.map((dataItem, index) => (
                <VerticalTimelineElement
                  position="right"
                  className={`vertical-timeline-element--work ${(index - 1) > 0 && updates[index - 1].updated.date !== dataItem.updated.date ? '' : 'hide-date'}`}
                  iconStyle={
                    index === 0 ? {
                      background: '#20C86D', height: 30, width: 30, marginLeft: -15,
                    } : {}}
                  date={(index - 1) > 0
                    ? updates[index - 1].updated.date !== dataItem.updated.date
                      ? moment(updates[index].updated.date).format('MMMM YYYY') : null : null}
                >
                  <Item.Group>
                    <Item>
                      <div className="ui image avatar-image">
                        {companyAvatarUrl && companyAvatarUrl.length
                          ? <Image64 srcUrl={companyAvatarUrl} circular />
                          : <UserAvatar UserInfo={{ firstName: get(campaign, 'keyTerms.shorthandBusinessName'), lastName: '', avatarUrl: '' }} />
                      }
                      </div>
                      <Item.Content verticalAlign="middle" className="grey-header">
                        {get(campaign, 'keyTerms.shorthandBusinessName') }<br />
                        <span>{moment(dataItem.updated.date).format('ll')}</span>
                      </Item.Content>
                    </Item>
                    <Header as="h4">{dataItem.title}</Header>
                    <div
                      style={readMoreStatus[index] ? { display: 'block' } : { display: 'none' }}
                    >
                      <HtmlEditor
                        readOnly
                        content={dataItem.content.length <= 805
                          ? dataItem.content : dataItem.content.substring(0, 805)}
                      />
                      {dataItem.content.length > 805
                        ? (
                        <a
                          href
                          onClick={
                            () => this.props.campaignStore.handleReadMoreReadLess(index)
                          }
                          id={index}
                        >
                          Read More
                        </a>
                        ) : ''
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
          )
          : <InlineLoader text="No Updates" className="bg-offwhite" />
        }
      </div>
    );
  }
}

export default Updates;
