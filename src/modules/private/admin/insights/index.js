import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageInsights from './containers/ManageInsights';
import EditArticle from './components/EditArticle';

export default class Insights extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageInsights} />
        <Route exact path={`${match.url}/:id`} render={() => <EditArticle refLink={match.url} {...this.props} />} />
      </Switch>
    );
  }
}
