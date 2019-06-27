import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Header, Form, Grid, Button, Divider } from 'semantic-ui-react';
import { ByKeyword, DropdownFilter } from '../../../../../../theme/form/Filters';
import RewardList from './RewardList';

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

@inject('offeringCreationStore', 'userStore', 'offeringsStore')
@observer
export default class Report extends Component {
  setSearchParam = (e, { name, value }) => {
    this.props.offeringCreationStore.setInitiateSrch(name, value);
  }

  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.offeringCreationStore.setInitiateSrch('keyword', e.target.value);
    }
  }

  render() {
    const { requestState } = this.props.offeringCreationStore;
    const { isIssuer } = this.props.userStore;
    const { offer } = this.props.offeringsStore;
    return (
      <>
        <Form className={offer.stage !== 'CREATION' ? 'search-filters more inner-content-spacer' : ''}>
          <Grid stackable className="bottom-aligned">
            <Grid.Row>
              <ByKeyword
                executeSearch={this.executeSearch}
                w={[7]}
                placeholder="Search by name"
                more="no"
                addon={(
                  <>
                    <Grid.Column width={6}>
                      <DropdownFilter value={requestState.search.amount} name="Investment amount" change={this.setSearchParam} options={[]} />
                    </Grid.Column>
                    <Grid.Column width={3} textAlign="right">
                      <Button primary floated="right">Manage PIN</Button>
                    </Grid.Column>
                  </>
)}
              />
            </Grid.Row>
          </Grid>
        </Form>
        <div className={offer.stage !== 'CREATION' ? 'inner-content-spacer' : ''}>
          {isIssuer
            && <Divider hidden />
          }
          <Header as="h4">
            Bonus rewards
            <Header.Subheader>For more information about bonus rewards, check out our <Link to="/">Resource Article.</Link></Header.Subheader>
          </Header>
          <RewardList listOf="Early bird reward" data={rewards} />
        </div>
      </>
    );
  }
}
