import React, { Component } from 'react';
import moment from 'moment';
import { Header, Modal, Label, Item, Image, Segment } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import 'react-vertical-timeline-component/style.min.css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';

@inject('updatesStore')
@observer
class MeetTeamModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    const { allData } = this.props.updatesStore;
    return (
      <Modal
        open
        size="large"
        onClose={this.handleClose}
        closeIcon
      >
        <Header as="h3">
          Updates
          <Label circular color="blue" key="blue">{allData.length}</Label>
        </Header>
        <Modal.Content scrolling className="updates-modal">
          <VerticalTimeline>
            {
                allData.map((dataItem, index) => (
                  <VerticalTimelineElement
                    className={`vertical-timeline-element--work ${(index - 1) > 0 && allData[index - 1].date !== dataItem.date ? '' : 'hide-date'}`}
                    iconStyle={
                      index === 0 ?
                      {
                        background: '#20C86D', height: 42, width: 42, marginLeft: -22,
                      } : {}}
                    date={(index - 1) > 0 &&
                      allData[index - 1].date !== dataItem.date ?
                      moment(allData[index].date).format('MMMM YYYY') : null}
                  >
                    <Item.Group>
                      <Item>
                        <Item.Image circular size="mini" src={dataItem.avatar} />
                        <Item.Content verticalAlign="middle" >{dataItem.name} <br /><span className="highlight-text">{moment(dataItem.date).format('LL')}</span></Item.Content>
                      </Item>
                      <Header as="h5">{dataItem.title}</Header>
                      <p>
                        {dataItem.description}
                      </p>
                      <p>
                        {dataItem.postImage && <Image src={dataItem.postImage} />}
                      </p>
                      <p>
                        {dataItem.externalArticleLink &&
                          <a href={`${dataItem.externalArticleLink}`} target="blank">
                            <Segment>
                              <Header as="h6">
                                <Image size="small" src={dataItem.extArticalImage} />
                                <Header.Content>
                                  {dataItem.extArticalTitle}
                                  <Header.Subheader as="p">{dataItem.externalArticleLink}</Header.Subheader>
                                </Header.Content>
                              </Header>
                            </Segment>
                          </a>
                        }
                      </p>
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
