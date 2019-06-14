import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { get } from 'lodash';
import ChartPieForBonusRewards from './ChartPieForBonusRewards';
import Helper from '../../../../../../helper/utility';
import NSImage from '../../../../../shared/NSImage';

class BonusRewards extends Component {
  render() {
    const { campaign } = this.props;
    const rewardsTiers = get(campaign, 'rewardsTiers') || [];
    const shorthandBusinessName = campaign && campaign.keyTerms
      && campaign.keyTerms.shorthandBusinessName
      ? campaign.keyTerms.shorthandBusinessName : '';
    const earlyBirdDetails = get(campaign, 'earlyBird') || null;
    const isEarlyBirdExists = (earlyBirdDetails && earlyBirdDetails.quantity > 0);
    const earlyBirdsCount = get(campaign, 'earlyBirdsCount') || 0;
    const earlyBirdQuantity = (earlyBirdDetails && earlyBirdDetails.quantity) || 0;
    const COLORS = ['#E6E7EB', '#20C86D'];
    const bonusDetails = [
      { name: earlyBirdsCount, value: earlyBirdQuantity },
      { name: earlyBirdsCount, value: earlyBirdsCount || 0 },
    ];
    return (
      <>
        <Header as="h3">Bonus Rewards</Header>
        {rewardsTiers && rewardsTiers.length
          ? (!isEarlyBirdExists
            ? (
              <>
                <NSImage path="illustration.png" className="no-early-bird" />
                <p className="center-align neutral-text mb-0"><b>Invest more, receive more.</b></p>
                <p className="early-bird-desc center-align">
                  {`See the bonus rewards ${shorthandBusinessName} is offering for higher
              levels of investment.`}
                </p>
              </>
            )
            : (
              <>
                <div className="boanusreward-chart">
                  <ChartPieForBonusRewards
                    title={earlyBirdsCount}
                    data={bonusDetails}
                    colors={COLORS}
                  />
                </div>
                <p className="center-align neutral-text mb-0">
                  <b>
                    <span className="primary-text">Early Bird</span>
                    {' '}
rewards remaining
                  </b>
                </p>
                <p className="early-bird-desc center-align">
                First
                  {' '}
                  {earlyBirdDetails.quantity}
                  {' '}
                  {earlyBirdDetails.amount > 0 ? `to invest ${Helper.CurrencyFormat(earlyBirdDetails.amount)}+` : ''}
                </p>
              </>
            ))
          : (
            <>
              <NSImage path="illustration.png" className="no-early-bird" />
              <p className="center-align neutral-text mb-0"><b>No Bonus Rewards for this Campaign.</b></p>
            </>
          )
        }
      </>
    );
  }
}

export default BonusRewards;
