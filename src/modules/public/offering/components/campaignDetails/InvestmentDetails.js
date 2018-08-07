import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject } from 'mobx-react';
// import { Grid } from 'semantic-ui-react';
import TermNote from './investmentDetails/TermNote';
import RevenueShare from './investmentDetails/RevenueShare';

@inject('campaignStore')
class InvestmentDetails extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    console.log(campaign, 'campaign');
    return (
      <Aux>
        {campaign.investmentType === 'Revenue Sharing' ?
          <RevenueShare /> : <TermNote />
        }
      </Aux>
      // <Grid>
      //   <Grid.Row>
      //     <Grid.Column width={12}>
      //     </Grid.Column>
      //     <Grid.Column width={4} />
      //   </Grid.Row>
      // </Grid>
    );
  }
}

export default InvestmentDetails;
