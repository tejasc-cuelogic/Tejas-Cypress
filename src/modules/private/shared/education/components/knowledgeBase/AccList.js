import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Accordion, Icon, List } from 'semantic-ui-react';
import mapValues from 'lodash/mapValues';

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
      currId = this.props.educationStore.selected.id;
    }
    const ids = mapValues(record[key], f => f.id);
    return this.state.activeIndex === record.id || Object.values(ids).includes(currId);
  }
  render() {
    const { match, data, module } = this.props;
    const params = {
      subItems: `${module}Items`,
      item: module === 'faq' ? 'question' : 'title',
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
                refItem={record[params.subItems].length > 0 ? record[params.subItems][0].id : ''}
              >
                {record[params.item]}
                <Icon className="ns-chevron-down" />
              </Accordion.Title>
              <Accordion.Content active={this.isActive(record, params.subItems)}>
                {record[params.subItems].length > 0 ? (
                  <List divided relaxed="very">
                    {
                      record[params.subItems].map(item => (
                        <List.Item
                          className={selected && selected.id === item.id ? 'active' : ''}
                          to={`${match.url}/${item.id}`}
                          key={item.id}
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
      </Accordion>
    );
  }
}
