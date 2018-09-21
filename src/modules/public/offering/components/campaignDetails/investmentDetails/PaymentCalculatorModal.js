import React, { Component } from 'react';
import { Modal, Grid, Statistic } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import PaymentCalculator from './PaymentCalculator';

@inject('updatesStore')
@observer
class PaymentCalculatorModal extends Component {
  handleClose = () => this.props.history.goBack();
  render() {
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="large"
        closeIcon
      >
        <Modal.Header>Total Payment Calculator</Modal.Header>
        <Modal.Content>
          <Grid columns={4} divided doubling className="mb-30 mt-30 investment-grid">
            <Grid.Column>
              <Statistic className="basic" size="mini">
                <Statistic.Label>Interest Rate*</Statistic.Label>
                <Statistic.Value>16.00%</Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic className="basic" size="mini">
                <Statistic.Label>Term</Statistic.Label>
                <Statistic.Value>60 months</Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic className="basic" size="mini">
                <Statistic.Label>Principal</Statistic.Label>
                <Statistic.Value className="highlight-text">
                $100
                </Statistic.Value>
                <div className="slidecontainer">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value="10"
                    className="slider mt-10 mb-10"
                    id="myRange"
                  />
                </div>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic className="basic" size="mini">
                <Statistic.Label>Total Payment*</Statistic.Label>
                <Statistic.Value>$146</Statistic.Value>
              </Statistic>
            </Grid.Column>
          </Grid>
          <PaymentCalculator />
          <p className="mt-30">
            * Payment for any given month (including the total payment at the end of the
            final month) indicates the cumulative amount contractually required to be paid
            to an investor after the end of that month, assuming the loan is not prepaid.
            This calculation is a mathematical illustration only and may not reflect actual
            performance. It does not take into account NextSeed fees of 1% on each payment
            made to investors. Payment is not guaranteed or insured and investors may lose
            some or all of the principal invested if the Issuer cannot make its payments.
          </p>
        </Modal.Content>
      </Modal>
    );
  }
}

export default PaymentCalculatorModal;
