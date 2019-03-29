import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Accordion, Icon, List } from 'semantic-ui-react';
import { REACT_APP_DEPLOY_ENV } from '../../../../../../constants/common';

@inject('educationStore')
@observer
export default class AccList extends Component {
  state = { activeIndex: 0 };
  toggleAction = (e, titleProps) => {
    const { index, refItem } = titleProps;
    const { activeIndex } = this.state;
    this.setState({ activeIndex: (activeIndex === index ? -1 : index) });
    if (refItem !== '') {
      this.props.educationStore.getOne(this.props.module, refItem);
    }
  }
  isActive = (record, key) => {
    let currId = this.props.location.pathname.split('/')[4];
    if (this.props.educationStore.selected) {
      currId = this.props.educationStore.selected.slug || this.props.educationStore.selected.id;
    }
    const ids = record[key].map(item => item.slug);
    return this.state.activeIndex === record.id || record.slug || ids.includes(currId);
  }
  render() {
    const isDev = !['production', 'demo'].includes(REACT_APP_DEPLOY_ENV);
    const {
      match, data, module,
      marketing,
    } = this.props;
    const params = {
      subItems: module === 'knowledgeBase' ? 'knowledgeBaseItemList' : 'faqItems',
      item: module === 'knowledgeBase' ? 'title' : 'question',
    };
    const { selected } = this.props.educationStore;
    return (
      <Accordion className="splitted">
        {
          data.map(record => (
            <Aux key={record.id}>
              <Accordion.Title
                active={this.isActive(record, params.subItems)}
                onClick={this.toggleAction}
                index={record.id}
                refItem={record[params.subItems].length > 0 ? record[params.subItems][0].slug : ''}
              >
                {record.categoryName}
                <Icon className="ns-chevron-down" />
              </Accordion.Title>
              <Accordion.Content active={this.isActive(record, params.subItems)}>
                {record[params.subItems].length > 0 ? (
                  <List divided relaxed="very">
                    {
                      record[params.subItems].map(item => (
                        <List.Item
                          className={selected && selected.slug === item.slug ? 'active' : ''}
                          to={`${match.url}/${item.slug}`}
                          key={item.slug}
                          as={NavLink}
                        >
                          {item[params.item]}
                        </List.Item>
                      ))
                    }
                  </List>
                ) : 'No record to display.'
                }
              </Accordion.Content>
            </Aux>
          ))
        }
        {isDev && marketing ?
          <Accordion.Title
            refItem="faq"
            onClick={this.toggleAction}
            as={NavLink}
            to={`${match.url}/faq`}
          >
            FAQ
          </Accordion.Title> : ''
        }
      </Accordion>
    );
  }
}
