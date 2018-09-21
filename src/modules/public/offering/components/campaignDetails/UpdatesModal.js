import React, { Component } from 'react';
import moment from 'moment';
import { Header, Modal, Label, Item, Image, List } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import 'react-vertical-timeline-component/style.min.css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';

const isMobile = document.documentElement.clientWidth < 768;
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
                      (index === 0) && isMobile ?
                      {
                        background: '#20C86D', height: 25, width: 25, marginLeft: -14,
                      } : index === 0 ? {
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
                      {dataItem.postImage && <Image src={dataItem.postImage} className="mb-20 mt-20" />}
                      {dataItem.externalArticleLink &&
                        <List as="a" href={`${dataItem.externalArticleLink}`} target="blank" verticalAlign="middle">
                          <List.Item>
                            <Image size="tiny" src={dataItem.extArticalImage} />
                            <List.Content>
                              <List.Header>{dataItem.extArticalTitle}</List.Header>
                              <List.Description>{dataItem.externalArticleLink}</List.Description>
                            </List.Content>
                          </List.Item>
                        </List>
                      }
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
