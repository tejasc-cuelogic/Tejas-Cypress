import React, { Component } from 'react';
import { Header, Grid, Statistic } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { InlineLoader } from '../../../../../../theme/shared';
import helper from '../../../../../../helper/utility';
import PaymentCalculator from './PaymentCalculator';

const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth < 992;

@inject('campaignStore')
@observer
class totalPaymentCalculator extends Component {
  state = {
    offeringAmt: 0,
    RangeValue: 0,
  }

  constructor(props) {
    super(props);
    this.props.campaignStore.calculateTotalPaymentData();
  }


  handleViewGallary = (e, index) => {
    e.preventDefault();
    this.props.campaignStore.setFieldValue('gallarySelectedImageIndex', index);
    this.props.history.push(`${this.props.galleryUrl.replace(/\/$/, '')}/photogallery`);
  }

  handleRangeChange = (e) => {
    const offeringAmt = (e.target.value / e.target.max) * 100;
    this.setState({ offeringAmt });
    this.setState({ RangeValue: e.target.value });
    this.props.campaignStore.calculateTotalPaymentData(e.target.value);
  }

  render() {
    const { newLayout } = this.props;
    const {
      totalPayment, principalAmt, totalPaymentChart, campaign,
    } = this.props.campaignStore;
    // const shorthandBusinessName = campaign && campaign.keyTerms &&
    //   campaign.keyTerms.shorthandBusinessName ?
    //   campaign.keyTerms.shorthandBusinessName : '';
    return (
        <>
        <Header as="h3" className={`${isTablet && 'mt-40'} ${newLayout && isTablet ? 'mb-20' : newLayout ? 'mt-40 mb-40' : 'mb-30'} anchor-wrap`}>
        Total Payment Calculator
        <span className="anchor" id="total-payment-calculator" />
      </Header>
      <Grid columns={4} divided stackable className={`${newLayout && isTablet ? 'mt-0 investment-grid-v2' : 'mt-30'} mb-30 investment-grid`}>
        <Grid.Column>
          <Statistic className="basic" size="mini">
            <Statistic.Label className={isMobile && 'center-align'}>Interest Rate*</Statistic.Label>
            <Statistic.Value className={isMobile && 'center-align'}>{parseFloat(get(campaign, 'keyTerms.interestRate')) || ' - '}%</Statistic.Value>
          </Statistic>
        </Grid.Column>
        <Grid.Column>
          <Statistic className="basic" size="mini">
            <Statistic.Label className={isMobile && 'center-align'}>Term</Statistic.Label>
            <Statistic.Value className={isMobile && 'center-align'}>{get(campaign, 'keyTerms.maturity') || ' - '} months</Statistic.Value>
          </Statistic>
        </Grid.Column>
        <Grid.Column>
          <Statistic className="basic" size="mini">
            <Statistic.Label className={isMobile && 'center-align'}>Principal</Statistic.Label>
            <Statistic.Value className={`${isMobile && 'center-align'} highlight-text mb-10`}>
              {helper.CurrencyFormat(principalAmt)}
            </Statistic.Value>
            <div className={`${isMobile && 'mb-20'} slider-container`}>
              <p style={{ width: `${this.state.offeringAmt}%` }} />
              <input
                type="range"
                min={0}
                max={6}
                value={this.state.RangeValue}
                onChange={this.handleRangeChange}
                className="slider mt-10 mb-10"
                id="myRange"
              />
              <span className="one" />
              <span className="two" />
              <span className="three" />
              <span className="four" />
              <span className="five" />
              <span className="six" />
              <span className="seven" />
            </div>
          </Statistic>
        </Grid.Column>
        <Grid.Column>
          <Statistic className="basic" size="mini">
            <Statistic.Label className={isMobile && 'center-align'}>Total Payment*</Statistic.Label>
            <Statistic.Value className={`highlight-text ${isMobile && 'center-align'}`}>{helper.CurrencyFormat(totalPayment)}</Statistic.Value>
          </Statistic>
        </Grid.Column>
      </Grid>
      {totalPaymentChart.length === parseFloat(get(campaign, 'keyTerms.maturity'))
        ? <PaymentCalculator data={totalPaymentChart} propsDetails={this.props} />
        : <p><InlineLoader text="Insufficient Data To Display Payment Calculator" /></p>
      }
      <p className="mt-30 note">
        * Payment for any given month (including the total payment at the end of the
        final month) indicates the cumulative amount contractually required to be paid
        to an investor after the end of that month, assuming the loan is not prepaid.
        This calculation is a mathematical illustration only and may not reflect actual
        performance. It does not take into account NextSeed fees of {Math.trunc(get(campaign, 'keyTerms.nsFeePercentage')) || '2'}% on each payment
        made to investors. Payment is not guaranteed or insured and investors may lose
        some or all of the principal invested if the Issuer cannot make its payments.
        </p>
      </>
    );
  }
}

export default totalPaymentCalculator;
