import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Form, Grid } from 'semantic-ui-react';
import { ByKeyword } from '../../../../../theme/form/Filters';
import Filters from './investors/Filters';
import Listing from './investors/Listing';

const investors = [
  {
    id: 1, name: 'Anna Maria Bach', city: 'Austin, TX', amount: 1200, investedDate: '12-23-2018', referral: 'g45345Xsa',
  },
  {
    id: 2, name: 'Evelinne Cyclist', city: 'Los Angeles, CA', amount: 950, investedDate: '7-11-2018',
  },
  {
    id: 3, name: 'Bob Brown', city: 'Chicago, IL', amount: 1040, investedDate: '12-22-2018', referral: 'jhg5kg5D',
  },
  {
    id: 4, name: 'Marika Walters', city: 'Los Angeles, CA', amount: 950, investedDate: '7-11-2018',
  },
  {
    id: 5, name: 'Stephen Smith', city: 'Chicago, IL', amount: 1040, investedDate: '12-22-2018', referral: 'jhg5kg5D',
  },
];

@inject('offeringCreationStore')
@observer
export default class BonusRewards extends Component {
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
    return (
      <div className="inner-content-spacer">
        <Form>
          <Grid stackable>
            <Grid.Row>
              <ByKeyword
                executeSearch={this.executeSearch}
                w={[4]}
                placeholder="Search by name"
                fLabel
                more="no"
                addon={
                  <Filters
                    requestState={requestState}
                    setSearchParam={this.setSearchParam}
                  />
                }
              />
            </Grid.Row>
          </Grid>
        </Form>
        <Listing data={investors} />
      </div>
    );
  }
}
