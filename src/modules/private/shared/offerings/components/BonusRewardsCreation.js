import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { Route, Link } from 'react-router-dom';
import AddNewTier from './bonusrewards/AddNewTier';

export default class BonusRewardsCreation extends Component {
  render() {
    const { match } = this.props;
    return (
      <div className="inner-content-spacer">
        <Route path={`${match.url}/add-new-tier`} render={props => <AddNewTier refLink={match.url} {...props} />} />
        <Button as={Link} to={`${match.url}/add-new-tier`} floated="right" primary content="Add new rewards tier" />
      </div>
    );
  }
}
