import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageCollections from './containers/ManageCollections';
import CollectionDetails from './containers/CollectionDetails';
import NewCollection from './components/NewCollection';


export default class Collections extends Component {
  render() {
    const { match, refMatch } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} render={props => <ManageCollections refMatch={refMatch} {...props} />} />
        <Route exact path={`${match.url}/new`} render={props => <NewCollection refLink={match.url} {...props} />} />
        <Route path={`${match.url}/:slug`} render={props => <CollectionDetails refLink={match.url} {...props} />} />
      </Switch>
    );
  }
}
