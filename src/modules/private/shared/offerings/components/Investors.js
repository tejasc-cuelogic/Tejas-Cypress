import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import { get } from 'lodash';
import { Form, Grid, Button } from 'semantic-ui-react';
import { ByKeyword } from '../../../../../theme/form/Filters';
import Listing from './investors/Listing';
import Helper from '../../../../../helper/utility';

@inject('userStore', 'offeringInvestorStore', 'offeringsStore')
@observer
export default class BonusRewards extends Component {
  componentWillMount() {
    this.props.offeringInvestorStore.initRequest(this.props.offeringId);
  }
  executeSearch = (e) => {
    this.props.offeringInvestorStore.setInitiateSrch('keyword', e.target.value);
  }
  populateCsvData = () => {
    const { investorLists } = this.props.offeringInvestorStore;
    const { offer } = this.props.offeringsStore;
    const fields = ['firstName', 'lastName', 'userEmail', 'city', 'state', 'accountType', 'amount', 'autoDraftAmount', 'credit', 'investmentDate', 'investmentsCount', 'referralCode.code', 'referralCode.isValid'];
    const params = {
      fields,
      data: toJS(investorLists),
      fileName: `${get(offer, 'keyTerms.shorthandBusinessName')}-investors`,
    };
    Helper.downloadCSV(params);
  }
  render() {
    const { requestState, investorLists } = this.props.offeringInvestorStore;
    const { isIssuer, isAdmin } = this.props.userStore;
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
                // }
              />
              {isAdmin &&
              <Grid.Column floated="right" width={3} className="right-align">
                <Button
                  primary
                  className="relaxed"
                  content="Export"
                  onClick={this.populateCsvData}
                  // loading={inProgress}
                  disabled={!investorLists.length}
                />
              </Grid.Column>
              }
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
