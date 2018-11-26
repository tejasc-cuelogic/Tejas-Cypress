import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Container, Button } from 'semantic-ui-react';
import Banner from '../components/Banner';
import CampaignList from '../components/listing/CampaignList';
import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';

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
      completedList, activeToDisplay, completedToDisplay,
    } = this.props.campaignStore;
    return (
      <Aux>
        <Banner />
        <CampaignList
          loading={loading}
          campaigns={active}
          filters
          heading={<Header as="h2" textAlign="center" caption className="mb-50">Active Campaigns</Header>}
        />
        {activeList && activeList.length > 9 && activeToDisplay < activeList.length &&
          <div className="center-align mb-50">
            <Button secondary content="Load More" onClick={() => loadMoreRecord('activeToDisplay')} />
          </div>
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
        {completedList && completedList.length > 9 && completedToDisplay < completedList.length &&
        <div className="center-align mb-50">
          <Button secondary content="Load More" onClick={() => loadMoreRecord('completedToDisplay')} />
        </div>
        }
      </Aux>
    );
  }
}

export default Offering;
