import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import AddNewCategory from '../categories/components/addNewCategoryModal';
import ManageCategories from './containers/manageCatories';

export default class Categories extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={ManageCategories} />
        <Route exact path={`${match.url}/:id`} render={() => <AddNewCategory refLink={match.url} />} />
      </Switch>
    );
  }
}
