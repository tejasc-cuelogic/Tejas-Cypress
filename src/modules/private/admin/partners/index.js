import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManagePartners from './containers/ManagePartners';
import EditPartner from './components/EditPartner';

export default class Partners extends Component {
  render() {
    const { match, refMatch } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} render={props => <ManagePartners refMatch={refMatch} {...props} />} />
        <Route exact path={`${match.url}/:id/:status`} render={props => <EditPartner refLink={match.url} {...props} />} />
      </Switch>
    );
  }
}
