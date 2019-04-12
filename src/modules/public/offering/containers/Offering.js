import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Container, Button, Responsive } from 'semantic-ui-react';
import Banner from '../components/Banner';
import CampaignList from '../components/listing/CampaignList';
import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';

const LoadMoreBtn = ({ action, param }) => (
  <div className="center-align mb-50">
    <Button secondary content="Load More" onClick={() => action(param)} />
  </div>
);
const isMobile = document.documentElement.clientWidth < 768;
@inject('campaignStore')
@observer
class Offering extends Component {
  componentWillMount() {
    this.props.campaignStore.initRequest(['active', 'completed']);
  }
  componentWillReceiveProps() {
    this.props.campaignStore.initRequest(['active', 'completed']);
  }
  render() {
    const {
      active, completed, loading, loadMoreRecord, activeList,
      completedList, activeToDisplay, completedToDisplay, RECORDS_TO_DISPLAY,
    } = this.props.campaignStore;
    return (
      <Aux>
        <Banner />
        <Responsive maxWidth={767} as={Container}>
          <Header as="h2" className="mt-30">
            Invest in growing local<br /> businesses
          </Header>
        </Responsive>
        <CampaignList
          loading={loading}
          campaigns={active}
          filters
          heading={<Header as={isMobile ? 'h3' : 'h2'} textAlign="center" caption className={isMobile ? 'mb-30' : 'mb-50'}>Active Campaigns</Header>}
        />
        {activeList && activeList.length > RECORDS_TO_DISPLAY &&
        activeToDisplay < activeList.length &&
          <LoadMoreBtn action={loadMoreRecord} param="activeToDisplay" />
        }
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
          campaigns={completed}
          locked={3}
          heading={<Header as="h2" textAlign="center" caption className="mb-50">Successfully Funded Campaigns</Header>}
        />
        {completedList && completedList.length > RECORDS_TO_DISPLAY
        && completedToDisplay < completedList.length &&
        <LoadMoreBtn action={loadMoreRecord} param="completedToDisplay" />
        }
      </Aux>
    );
  }
}

export default Offering;
