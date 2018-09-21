import React, { Component } from 'react';
import Aux from 'react-aux';
import { Button } from 'semantic-ui-react';
import { Route } from 'react-router-dom';
import AddNewTier from './bonusrewards/AddNewTier';

export default class BonusRewardsCreation extends Component {
  render() {
    const { match } = this.props;
    return (
      <Aux>
        <Route path={`${match.url}/add-new-tier`} render={props => <AddNewTier refLink={match.url} {...props} />} />
        <Button floated="right" primary content="Add new rewards tier" />
      </Aux>
    );
  }
}
