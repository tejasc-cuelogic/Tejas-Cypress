import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageFaqs from './containers/ManageFaqs';
import FaqDetails from './containers/FaqDetails';

export default class Faqs extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageFaqs} />
        <Route exact path={`${match.url}/:id`} component={FaqDetails} />
      </Switch>
    );
  }
}
