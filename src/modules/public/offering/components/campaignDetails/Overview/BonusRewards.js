import React, { Component } from 'react';
import { Header, Image } from 'semantic-ui-react';
import Aux from 'react-aux';
import { get } from 'lodash';
import { ASSETS_URL } from '../../../../../../constants/aws';
import ChartPieForBonusRewards from './ChartPieForBonusRewards';
import Helper from '../../../../../../helper/utility';

class BonusRewards extends Component {
  render() {
    const { campaign } = this.props;
    const rewardsTiers = get(campaign, 'rewardsTiers') || [];
    const shorthandBusinessName = campaign && campaign.keyTerms &&
      campaign.keyTerms.shorthandBusinessName ?
      campaign.keyTerms.shorthandBusinessName : '';
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
      <Aux>
        <Header as="h3">Bonus Rewards</Header>
        {rewardsTiers && rewardsTiers.length ?
          (!isEarlyBirdExists ?
            <Aux>
              <Image src={`${ASSETS_URL}images/illustration.png`} className="no-early-bird" />
              <p className="center-align neutral-text mb-0"><b>Invest more, receive more.</b></p>
              <p className="early-bird-desc center-align">
                {`See the bonus rewards ${shorthandBusinessName} is offering for higher
              levels of investment.`}
              </p>
            </Aux>
            :
            <Aux>
              <div className="boanusreward-chart">
                <ChartPieForBonusRewards
                  title={earlyBirdsCount}
                  data={bonusDetails}
                  colors={COLORS}
                />
              </div>
              <p className="center-align neutral-text mb-0"><b><span className="primary-text">Early Bird</span> rewards remaining</b></p>
              <p className="early-bird-desc center-align">
                First {earlyBirdDetails.quantity} {earlyBirdDetails.amount > 0 ? `to invest ${Helper.CurrencyFormat(earlyBirdDetails.amount)}+` : ''}
              </p>
            </Aux>)
          :
            <Aux>
              <Image src={`${ASSETS_URL}images/illustration.png`} className="no-early-bird" />
              <p className="center-align neutral-text mb-0"><b>No Bonus Rewards for this Campaign.</b></p>
            </Aux>
        }
      </Aux>
    );
  }
}

export default BonusRewards;
