import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Header, Card } from 'semantic-ui-react';

@inject('knowledgeBase')
@observer
export default class Details extends Component {
  componentWillMount() {
    this.props.knowledgeBase.getOne(this.props.refLink || 'KnowledgeBase', this.props.match.params.id);
  }
  render() {
    const { selected } = this.props.knowledgeBase;
    return (
      <Card fluid>
        <Card.Content className="padded">
          {selected ? (
            <Aux>
              <Header as="h3">{selected.heading || selected.text}</Header>
              <p>{selected.description}</p>
            </Aux>
            ) : <div>Nothing to display !</div>
          }
        </Card.Content>
      </Card>
    );
  }
}
