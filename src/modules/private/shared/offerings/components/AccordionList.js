import React, { Component } from 'react';
import { get } from 'lodash';
import { NavLink } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Accordion, Icon, List } from 'semantic-ui-react';

@inject('campaignStore')
@observer
export default class AccordionList extends Component {
  toggleAction = () => {
    const { objKey, campaignStore } = this.props;
    const { documentMeta, setFieldValue } = campaignStore;
    setFieldValue('documentMeta', !get(documentMeta, `${objKey}.accordionActive`), `${objKey}.accordionActive`);
  }

  updateDocId = (docId) => {
    this.props.campaignStore.setFieldValue('documentMeta', docId, `${this.props.objKey}.selectedDoc`);
  }

  render() {
    const {
      match, data, title, campaignStore, objKey,
    } = this.props;
    const { documentMeta } = campaignStore;
    const selectedDoc = get(documentMeta, `${objKey}.selectedDoc`);
    const accordionActive = get(documentMeta, `${objKey}.accordionActive`);
    return (
      <Accordion className="splitted">
        <Accordion.Title
          active={accordionActive}
          onClick={this.toggleAction}
        >
          {title}
          <Icon className="ns-chevron-down" />
        </Accordion.Title>
        <Accordion.Content active={accordionActive}>
          {data && data.length ? (
            <List divided relaxed="very">
              {data.map(item => (
                  <List.Item
                    className={selectedDoc === item.documentId ? 'active' : ''}
                    onClick={() => this.updateDocId(item.documentId)}
                    to={`${match.url}/${item.documentId}`}
                    key={item.documentId}
                    as={NavLink}
                  >
                    {item.name}
                  </List.Item>
              ))}
            </List>
          ) : 'No record to display.'
          }
        </Accordion.Content>
      </Accordion>
    );
  }
}
