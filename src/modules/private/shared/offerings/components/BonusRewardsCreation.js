import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { Route, Link } from 'react-router-dom';
import AddNewTier from './bonusrewards/AddNewTier';
import AddNewBonusReward from './bonusrewards/addNewBonusRewards';


const tiersArray = [
  { title: 'Early Birds' },
  { title: 'Invest $500 or more' },
  { title: 'Invest $1000 or more' },
  { title: 'Invest $5000 or more' },
];
export default class BonusRewardsCreation extends Component {
  render() {
    const { match } = this.props;
    return (
      <div className="inner-content-spacer">
        <Route path={`${match.url}/add-new-tier`} render={props => <AddNewTier refLink={match.url} {...props} />} />
        <Route path={`${match.url}/add-new-bonus-reward`} render={props => <AddNewBonusReward refLink={match.url} {...props} />} />
        <div className="clearfix">
          <Button as={Link} to={`${match.url}/add-new-tier`} floated="right" primary content="Add new rewards tier" />
        </div>
        {
          tiersArray.map(data => (
            <div className="featured-section mb-20">
              <p> {data.title} </p>
              <Button size="small" color="blue" as={Link} to={`${match.url}/add-new-bonus-reward`} className="link-button">+ Add next bonus reward</Button>
            </div>
          ))
        }
      </div>
    );
  }
}
