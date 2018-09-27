import React, { Component } from 'react';
import { Button, Header, Icon, Confirm } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Route, Link } from 'react-router-dom';
import AddNewTier from './bonusrewards/AddNewTier';
import AddNewBonusReward from './bonusrewards/addNewBonusRewards';
import Helper from '../../../../../helper/utility';

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

@inject('offeringCreationStore', 'userStore')
@observer
export default class BonusRewardsCreation extends Component {
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
    const { confirmModal, confirmModalName } = this.props.offeringCreationStore;
    const { match } = this.props;
    const { isIssuer } = this.props.userStore;
    return (
      <div className={!isIssuer ? 'inner-content-spacer' : ''}>
        <Route path={`${match.url}/add-new-tier`} render={props => <AddNewTier refLink={match.url} {...props} />} />
        <Route path={`${match.url}/add-new-bonus-reward`} render={props => <AddNewBonusReward refLink={match.url} {...props} />} />
        <Route path={`${match.url}/edit-new-bonus-reward`} render={props => <AddNewBonusReward refLink={match.url} {...props} />} />
        <div className="clearfix">
          <Button as={Link} to={`${match.url}/add-new-tier`} floated="right" primary content="Add new rewards tier" />
        </div>
        {
          tiersArray.map(data => (
            <div className={!isIssuer ? 'reward-tier' : 'ui card fluid form-card'}>
              <Header as="h4">
                {data.title}
                <Button color="red" size="small" floated="right" className="link-button" onClick={e => this.removed(e)}>
                  <Icon className="ns-trash" />
                </Button>
              </Header>
              {data.bonusRewards &&
              data.bonusRewards.map((item, index) => (
                <div className="reward-wrap">
                  <Header as="h5">{item.title}</Header>
                  <p>{item.description}</p>
                  <p>Exp Date: {item.expDate}</p>
                  <Button.Group size="mini" className="compact">
                    <Button inverted color="blue" content="Edit" as={Link} to={`${match.url}/edit-new-bonus-reward`} />
                    <Button color="red" content="Delete" onClick={e => this.toggleConfirmModal(e, index, 'ADD_NEW_BONUS_REWARD_FRM')} />
                  </Button.Group>
                </div>
              ))
              }
              <div>
                <Button size="small" color="blue" as={Link} to={`${match.url}/add-new-bonus-reward`} className="link-button">+ Add next bonus reward</Button>
              </div>
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
