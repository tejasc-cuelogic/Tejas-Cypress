import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Form, Grid } from 'semantic-ui-react';
import { ByKeyword } from '../../../../../theme/form/Filters';
// import Filters from './investors/Filters';
import Listing from './investors/Listing';

@inject('userStore', 'offeringInvestorStore')
@observer
export default class BonusRewards extends Component {
  componentWillMount() {
    this.props.offeringInvestorStore.initRequest(this.props.offeringId);
  }
  // setSearchParam = (e, { name, value }) => {
  //   this.props.offeringInvestorStore.setInitiateSrch(name, value);
  // }
  executeSearch = (e) => {
    this.props.offeringInvestorStore.setInitiateSrch('keyword', e.target.value);
  }
  render() {
    const { requestState } = this.props.offeringInvestorStore;
    const { isIssuer } = this.props.userStore;
    return (
      <Aux>
        <Form className={!isIssuer ? 'search-filters more inner-content-spacer' : ''}>
          <Grid stackable className="bottom-aligned">
            <Grid.Row>
              <ByKeyword
                change={this.executeSearch}
                w={[4]}
                placeholder="Search by name, city"
                more="no"
                requestState={requestState}
                // addon={
                //   <Filters
                //     requestState={requestState}
                //     setSearchParam={this.setSearchParam}
                //   />
                // }
              />
            </Grid.Row>
          </Grid>
        </Form>
        <div className={isIssuer ? 'ui card fluid' : ''}>
          <Listing />
        </div>
      </Aux>
    );
  }
}
