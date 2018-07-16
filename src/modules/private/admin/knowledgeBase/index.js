import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageKnowledgeBase from './containers/ManageKnowledgeBase';
import KnowledgeBaseDetails from './containers/KnowledgeBaseDetails';

export default class KnowledgeBase extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageKnowledgeBase} />
        <Route exact path={`${match.url}/:id`} component={KnowledgeBaseDetails} />
      </Switch>
    );
  }
}
