import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import AddNewCategory from './components/addNewCategoryModal';
import ManageCategories from './containers/manageCatories';

export default class Categories extends Component {
  render() {
    const { match, refMatch } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} render={props => <ManageCategories refMatch={refMatch} {...props} />} />
        <Route exact path={`${match.url}/:id`} render={props => <AddNewCategory refLink={match.url} {...props} />} />
      </Switch>
    );
  }
}
