import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Header, Card } from 'semantic-ui-react';

@inject('educationStore')
@observer
export default class Details extends Component {
  componentWillMount() {
    this.props.educationStore.getOne(this.props.module, this.props.match.params.id);
  }
  componentWillReceiveProps(nextProps) {
    this.props.educationStore.getOne(this.props.module, nextProps.match.params.id);
  }
  render() {
    const { selected } = this.props.educationStore;
    const details = (selected ? (
      <Aux>
        <Header as="h3">{selected.title}</Header>
        <p>{selected.body}</p>
      </Aux>
    ) : <div>Nothing to display !</div>);
    if (this.props.marketing) {
      return details;
    }
    return (
      <Card fluid>
        <Card.Content className="padded knowledge-details">
          <div dangerouslySetInnerHTML={{ __html: details }} />
        </Card.Content>
      </Card>
    );
  }
}
