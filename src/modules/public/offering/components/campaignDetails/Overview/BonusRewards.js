import React, { Component } from 'react';
import { Header, Grid, Image, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { orderBy } from 'lodash';
import { ASSETS_URL } from '../../../../../../constants/aws';

class BonusRewards extends Component {
  render() {
    const { isTabletLand, refLink, campaign } = this.props;
    const rewardsTiers = campaign && campaign.rewardsTierIds &&
      campaign.rewardsTierIds.length && orderBy(campaign.rewardsTierIds, ['earlyBirdQuantity', 'amount'], ['desc', 'asc']);
    const shorthandBusinessName = campaign && campaign.keyTerms &&
      campaign.keyTerms.shorthandBusinessName ?
      campaign.keyTerms.shorthandBusinessName : '';
    return (
      <Grid.Column className={isTabletLand && 'mt-30'}>
        <Segment padded>
          <Header as="h4">
            <Link to={`${refLink}/bonus-rewards`}>
              Bonus Rewards
              <Icon className="ns-chevron-right" color="green" />
            </Link>
          </Header>
          {rewardsTiers ?
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
              <Image src={`${ASSETS_URL}images/illustration.png`} className="no-early-bird" />
              <p className="center-align neutral-text mb-0"><b><span className="primary-text">Early Bird</span> rewards remaining</b></p>
              <p className="early-bird-desc center-align">
                First 100 to invest $1,000+
              </p>
            </Aux>
          }
        </Segment>
        {/* <Segment padded>
          <Breadcrumb>
            <Breadcrumb.Section>Bonus Rewards</Breadcrumb.Section>
            <Breadcrumb.Divider icon={{ className: 'ns-chevron-right' }} />
          </Breadcrumb>
          <Header as="h3">Early Bird Rewards</Header>
        </Segment> */}
      </Grid.Column>
    );
  }
}

export default BonusRewards;
