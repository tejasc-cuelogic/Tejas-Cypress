import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Header, Card, Form, Input } from 'semantic-ui-react';
import HtmlEditor from '../../../../../shared/HtmlEditor';

@inject('educationStore')
@observer
export default class Details extends Component {
  componentWillMount() {
    this.props.educationStore.getOne(this.props.module, this.props.match.params.slug);
  }
  componentWillReceiveProps(nextProps) {
    this.props.educationStore.getOne(this.props.module, nextProps.match.params.slug);
  }
  search = (e) => {
    this.props.educationStore.setSrchParam(e.target.value);
  }
  render() {
    const { selected, searchParam } = this.props.educationStore;
    const details = (selected ? (
      <Aux>
        {this.props.match.params && this.props.match.params.slug !== 'faq' && !this.props.location.pathname.includes('/app/') &&
        <Form>
          <Input
            fluid
            onChange={this.search}
            value={searchParam.KnowledgeBase}
            inverted
            icon={{ className: 'ns-search' }}
            iconPosition="left"
            placeholder="Search by keyword or phrase"
          />
        </Form>
        }
        <Header as="h3">{selected.title}</Header>
        <pre className="migrated-content">
          <HtmlEditor readOnly content={(selected.content || '')} />
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
