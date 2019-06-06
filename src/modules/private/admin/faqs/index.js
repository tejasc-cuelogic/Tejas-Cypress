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
    const { match, refMatch } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} render={props => <ManageFaqs refMatch={refMatch} {...props} />} />
        <Route exact path={`${match.url}/:id/:status/:faqType?/:categoryId?`} render={props => <FaqDetails refLink={match.url} {...props} />} />
      </Switch>
    );
  }
}
