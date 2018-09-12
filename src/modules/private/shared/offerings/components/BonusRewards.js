import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Aux from 'react-aux';
import { Header, Form, Grid, Button } from 'semantic-ui-react';
import { ByKeyword, DropdownFilter } from '../../../../../theme/form/Filters';
import RewardList from './rewards/RewardList';

const rewards = [
  {
    id: 1, name: 'Anna Maria Bach', amount: 1200, redeemDate: '12-23-2018',
  },
  {
    id: 2, name: 'Evelinne Cyclist', amount: 950, redeemDate: '7-11-2018',
  },
  {
    id: 3, name: 'Bob Brown', amount: 1040, redeemDate: '12-22-2018',
  },
];

@inject('offeringCreationStore')
@observer
export default class BonusRewards extends Component {
  setSearchParam = (e, { name, value }) => this.props.crowdpayStore.setInitiateSrch(name, value);
  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.offeringCreationStore.setInitiateSrch('keyword', e.target.value);
    }
  }
  render() {
    const { requestState } = this.props.offeringCreationStore;
    return (
      <div className="inner-content-spacer">
        <Header as="h4">Bonus rewards</Header>
        <Form>
          <Grid stackable>
            <Grid.Row>
              <ByKeyword
                executeSearch={this.executeSearch}
                w={[7]}
                placeholder="Search by name"
                fLabel
                more="no"
                addon={
                  <Aux>
                    <Grid.Column width={6}>
                      <DropdownFilter value={requestState.search.amount} name="Investment amount" change={this.setSearchParam} options={[]} />
                    </Grid.Column>
                    <Grid.Column width={3} textAlign="right">
                      <Button primary floated="right">Manage PIN</Button>
                    </Grid.Column>
                  </Aux>
                }
              />
            </Grid.Row>
          </Grid>
        </Form>
        <p className="note mt-30">For more information about bonus rewards, check out our Resource Article.</p>
        <RewardList listOf="Early bird reward" data={rewards} />
      </div>
    );
  }
}
