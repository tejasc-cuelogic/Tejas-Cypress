import React, { Component } from 'react';
import { Header, Grid } from 'semantic-ui-react';
import { FaqWidget } from '../../../theme/common/ImportCommon';
import AvailableCashTransfer from '../components/transferFunds/AvailableCashTransfer';

const data = {
  availableCash: 9743.33,
  faqs: [
    {
      id: 1,
      title: 'Are these one-time investments or monthly investments?',
      description: `Funds for your investment will first be taken from the available cash sitting in
      your NextSeed account. If you have insufficient funds in your NextSeed account,
      you will be prompted to request an immediate transfer of funds from your external banking account
      to your NextSeed account.`,
    },
    {
      id: 2,
      title: 'Can I cancel my investment after the closing?',
      description: `Unlike investing in in companies listed on a stock exchange where you can quickly
      and easily trade securities, there is no public market for crowdfunded securities.`,
    },
  ],
};

export default class TransferFunds extends Component {
  render() {
    return (
      <div>
        <Header as="h3">Transfer funds</Header>
        <Grid>
          <Grid.Row>
            <Grid.Column widescreen={8} largeScreen={12} computer={13} tablet={16} mobile={16}>
              <AvailableCashTransfer match={this.props.match} cash={data.availableCash} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column widescreen={6} largeScreen={10} computer={10} tablet={13} mobile={16}>
              <FaqWidget heading="Transfer Funds" faqs={data.faqs} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
