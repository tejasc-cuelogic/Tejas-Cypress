import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageCategories from './containers/manageCatories';
import CategoriesDetails from './containers/categoriesDetails';

export default class Categories extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageCategories} />
        <Route exact path={`${match.url}/:id`} component={CategoriesDetails} />
      </Switch>
    );
  }
}
