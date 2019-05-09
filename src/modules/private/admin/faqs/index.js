import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { inject } from 'mobx-react';
import ManageFaqs from './containers/ManageFaqs';
import FaqDetails from './containers/FaqDetails';

@inject('articleStore')
@withRouter
export default class Faqs extends Component {
  componentWillMount() {
    this.props.articleStore.getCategoryListByTypes(false, ['INV_FAQ', 'ISSUER_FAQ']);
  }
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
