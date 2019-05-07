import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import ManageFaqs from './containers/ManageFaqs';
import FaqDetails from './containers/FaqDetails';

@withRouter
export default class Faqs extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageFaqs} />
        <Route exact path={`${match.url}/:id`} render={props => <FaqDetails refLink={match.url} {...props} />} />
      </Switch>
    );
  }
}
