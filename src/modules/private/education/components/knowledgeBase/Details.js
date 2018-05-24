import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Card } from 'semantic-ui-react';

@inject('knowledgeBase')
@observer
export default class Details extends Component {
  componentWillMount() {
    this.props.knowledgeBase.getOne(this.props.match.params.id);
  }
  render() {
    const { selected } = this.props.knowledgeBase;
    return (
      <Card fluid>
        <Card.Content className="padded">
          <Header as="h3">{selected.heading}</Header>
          <p>{selected.description}</p>
        </Card.Content>
      </Card>
    );
  }
}
