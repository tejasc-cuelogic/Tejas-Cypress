import React, { Component } from 'react';
import { Button, Header, Icon, Confirm } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Route, Link } from 'react-router-dom';
import AddNewTier from './AddNewTier';
import AddNewBonusReward from './addNewBonusRewards';
import BonusRewardsList from './BonusRewardsList';
import Helper from '../../../../../../helper/utility';

// const tiersArray = [
//   { title: 'Early Birds' },
//   {
//     title: 'Invest $500 or more',
//     bonusRewards: [{
//       title: '5 Class Series + 5 Free Shoe Rentals',
//       description: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper.
// Suspendisse a pellentesque dui, non felis.
// Maecenas malesuada elit lectus felis, malesuada ultricies. ',
//       expDate: 'May 23, 2018',
//     },
//     {
//       title: 'Opening Night Invitation',
//       description: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper.',
//       expDate: 'May 23, 2018',
//     }],
//   },
//   { title: 'Invest $1000 or more' },
//   { title: 'Invest $5000 or more' },
// ];

@inject('offeringCreationStore')
@observer
export default class Creation extends Component {
  componentWillMount() {
    const { getBonusRewardsTiers, getBonusRewards } = this.props.offeringCreationStore;
    getBonusRewardsTiers();
    getBonusRewards();
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }
  removeData = (confirmModalName) => {
    this.props.offeringCreationStore.removeData(confirmModalName);
    Helper.toast('Contingency has been deleted successfully.', 'success');
  }
  removed = (e) => {
    e.preventDefault();
    Helper.toast('The tier has been removed.', 'success');
  }
  render() {
    const {
      bonusRewards,
      confirmModal,
      confirmModalName,
      bonusRewardsTiers,
    } = this.props.offeringCreationStore;
    const { match } = this.props;
    console.log(bonusRewards);
    return (
      <div className="inner-content-spacer">
        <Route path={`${match.url}/add-new-tier`} render={props => <AddNewTier refLink={match.url} {...props} />} />
        <Route path={`${match.url}/add-new-bonus-reward`} render={props => <AddNewBonusReward refLink={match.url} {...props} />} />
        <Route path={`${match.url}/edit-new-bonus-reward`} render={props => <AddNewBonusReward refLink={match.url} {...props} />} />
        <div className="clearfix">
          <Button as={Link} to={`${match.url}/add-new-tier`} floated="right" primary content="Add new rewards tier" />
        </div>
        {
          bonusRewardsTiers.data.getBonusRewardTiers &&
          bonusRewardsTiers.data.getBonusRewardTiers.map(tier => (
            <div className="reward-tier">
              <Header as="h4">
                Invest ${tier.amount} or more
                <Button color="red" size="small" floated="right" className="link-button" onClick={e => this.removed(e)}>
                  <Icon className="ns-trash" />
                </Button>
              </Header>
              <BonusRewardsList refLink={match.ur} tier={tier} bonusRewards={bonusRewards} />
              <Button
                size="small"
                color="blue"
                as={Link}
                to={`${match.url}/add-new-bonus-reward`}
                className="link-button"
              >+ Add next bonus reward
              </Button>
            </div>
          ))
        }
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this contingency?"
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => this.removeData(confirmModalName)}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
