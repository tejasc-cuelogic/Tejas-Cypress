import React, { Component } from 'react';
import { Header, Grid, Image, Segment, Breadcrumb } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import noEarlyBird from '../../../../../../assets/images/illustration.png';

class BonusRewards extends Component {
  render() {
    const { isTabletLand, refLink } = this.props;
    return (
      <Grid.Column className={isTabletLand && 'mt-30'}>
        <Segment padded>
          <Breadcrumb>
            <Breadcrumb.Section as={Link} to={`${refLink}/bonus-rewards`}><b>Bonus Rewards</b></Breadcrumb.Section>
            <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
          </Breadcrumb>
          <Header as="h4">Investor Rewards</Header>
          <Image src={noEarlyBird} className="no-early-bird" />
          <p className="center-align"><b>Invest more, recieve more.</b></p>
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
