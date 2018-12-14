import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import Parser from 'html-react-parser';
import { Header, Card } from 'semantic-ui-react';

@inject('educationStore')
@observer
export default class Details extends Component {
  componentWillMount() {
    this.props.educationStore.getOne(this.props.module, this.props.match.params.slug);
  }
  componentWillReceiveProps(nextProps) {
    this.props.educationStore.getOne(this.props.module, nextProps.match.params.slug);
  }
  render() {
    const { selected } = this.props.educationStore;
    const details = (selected ? (
      <Aux>
        <Header as="h3">{selected.title}</Header>
        <pre className="migrated-content">
          {Parser(selected.content || '')}
        </pre>
      </Aux>
    ) : <div>Nothing to display !</div>);
    if (this.props.marketing) {
      return details;
    }
    return (
      <Card fluid>
        <Card.Content className="padded knowledge-details">
          {details}
        </Card.Content>
      </Card>
    );
  }
}
