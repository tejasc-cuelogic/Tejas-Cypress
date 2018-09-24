import React, { Component } from 'react';
import { Button, Header } from 'semantic-ui-react';
import { Route, Link } from 'react-router-dom';
import AddNewTier from './bonusrewards/AddNewTier';
import AddNewBonusReward from './bonusrewards/addNewBonusRewards';


const tiersArray = [
  { title: 'Early Birds' },
  {
    title: 'Invest $500 or more',
    bonusRewards: [{
      title: '5 Class Series + 5 Free Shoe Rentals',
      description: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. ',
      expDate: 'May 23, 2018',
    },
    {
      title: 'Opening Night Invitation',
      description: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper.',
      expDate: 'May 23, 2018',
    }],
  },
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
        <Route path={`${match.url}/edit-new-bonus-reward`} render={props => <AddNewBonusReward refLink={match.url} {...props} />} />
        <div className="clearfix">
          <Button as={Link} to={`${match.url}/add-new-tier`} floated="right" primary content="Add new rewards tier" />
        </div>
        {
          tiersArray.map(data => (
            <div className="featured-section mb-20">
              <Header as="h4"> {data.title} </Header>
              {data.bonusRewards &&
              data.bonusRewards.map(item => (
                <div className="featured-section mb-20">
                  <Header as="h5">{item.title}</Header>
                  <p>{item.description}</p>
                  <p>Exp Date: {item.expDate}</p>
                  <Button.Group>
                    <Button inverted size="mini" color="blue" content="Edit" as={Link} to={`${match.url}/edit-new-bonus-reward`} />
                    <Button type="button" size="mini" color="red" content="Delete" />
                  </Button.Group>
                </div>
              ))
              }
              <Button size="small" color="blue" as={Link} to={`${match.url}/add-new-bonus-reward`} className="link-button">+ Add next bonus reward</Button>
            </div>
          ))
        }
      </div>
    );
  }
}
