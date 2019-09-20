import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Button, Grid, Form } from 'semantic-ui-react';
import SummaryHeader from '../../../investor/accountDetails/components/portfolio/SummaryHeader';
import OfferingList from '../components/OfferingList';
import { ByKeyword } from '../../../../../theme/form/Filters';

@inject('repaymentStore')
@withRouter
@observer
export default class RepaymentDetails extends Component {
  constructor(props) {
    super(props);
    this.props.repaymentStore.initRepaymentDetails();
  }

  toggleSearch = () => this.props.repaymentStore.toggleSearch();

  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.repaymentStore.setInitiateSrch('keyword', e.target.value);
    }
  }

  render() {
    const {
      summary, repaymentDetails, requestState, filters,
    } = this.props.repaymentStore;
    return (
      <div>
        <Form>
          <Grid stackable>
            <Grid.Row>
              <ByKeyword
                executeSearch={this.executeSearch}
                w={[11]}
                placeholder="Search by keyword or phrase"
                toggleSearch={this.toggleSearch}
                requestState={requestState}
                filters={filters}
                more="no"
                addon={(
<Grid.Column width={5} textAlign="right">
                    <Button primary floated="right">Process Payments</Button>
                    <Button secondary floated="right">Save as Draft</Button>
                  </Grid.Column>
)}
              />
            </Grid.Row>
          </Grid>
        </Form>
        <SummaryHeader details={summary} cols={4} />
        <OfferingList listOf="Term Loan Offerings" data={repaymentDetails} />
        <OfferingList listOf="Rev Share Offerings" data={repaymentDetails} />
      </div>
    );
  }
}
