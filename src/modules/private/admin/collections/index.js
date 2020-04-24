import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageCollections from './containers/ManageCollections';
import CollectionDetails from './containers/CollectionDetails';

export default class Collections extends Component {
  render() {
    const { match, refMatch } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} render={props => <ManageCollections refMatch={refMatch} {...props} />} />
        <Route path={`${match.url}/:id/:status`} render={props => <CollectionDetails refLink={match.url} {...props} />} />
      </Switch>
    );
  }
}
