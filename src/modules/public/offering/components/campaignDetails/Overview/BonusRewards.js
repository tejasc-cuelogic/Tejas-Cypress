import React, { Component } from 'react';
import { Header, Grid, Image, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { ASSETS_URL } from '../../../../../../constants/aws';

class BonusRewards extends Component {
  render() {
    const { isTabletLand, refLink } = this.props;
    return (
      <Grid.Column className={isTabletLand && 'mt-30'}>
        <Segment padded>
          <Header as="h4">
            <Link to={`${refLink}/bonus-rewards`}>
              Bonus Rewards
              <Icon className="ns-chevron-right" color="green" />
            </Link>
          </Header>
          <Image src={`${ASSETS_URL}images/illustration.png`} className="no-early-bird" />
          <p className="center-align"><b>Invest more, receive more.</b></p>
          <p className="early-bird-desc center-align">
            See the bonus rewards BuffBrew Taproom is offering for higher
            levels of investment.
          </p>
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
