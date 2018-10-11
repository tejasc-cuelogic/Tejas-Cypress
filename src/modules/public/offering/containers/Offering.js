import React, { Component } from 'react';
import Aux from 'react-aux';
import { filter } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Header, Container } from 'semantic-ui-react';
import Banner from '../components/Banner';
import CampaignList from '../components/listing/CampaignList';
import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';
import { OFFERING_STAGE } from '../../../../services/constants/offering';

@inject('campaignStore')
@observer
class Offering extends Component {
  componentWillMount() {
    console.log(this.props);
    this.props.campaignStore.initRequest([OFFERING_STAGE.LIVE, OFFERING_STAGE.COMPLETE]);
  }
  render() {
    const { OfferingList, loading } = this.props.campaignStore;
    const liveCampaign = filter(OfferingList, ele => ele.stage === OFFERING_STAGE.LIVE);
    const completedCampaign = filter(OfferingList, ele => ele.stage === OFFERING_STAGE.COMPLETE);
    return (
      <Aux>
        <Banner />
        <CampaignList
          loading={loading}
          campaigns={liveCampaign}
          locked="cjk9pj4250d0f0123n0lng1qr"
          filters
          heading={<Header as="h2" textAlign="center" caption className="mb-50">Active Campaigns</Header>}
        />
        <section className="learn-more">
          <Container textAlign="center">
            <Header as="h2">Want to learn more about NextSeed?</Header>
            <p className="mb-30">
              Sign up for the mailing list to stay informed about new offerings,
              updates and events.
            </p>
            <SubscribeForNewsletter className="public-form" />
          </Container>
        </section>
        <CampaignList
          loading={loading}
          campaigns={completedCampaign}
          locked={3}
          heading={<Header as="h2" textAlign="center" caption className="mb-50">Successfully Funded Campaigns</Header>}
        />
      </Aux>
    );
  }
}

export default Offering;
