import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Container, Button, Divider } from 'semantic-ui-react';
// import Banner from '../components/Banner';
import CampaignList from '../components/listing/CampaignList';
import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';

const LoadMoreBtn = ({ action, param }) => (
  <div className="center-align mb-50" data-cy={param}>
    <Button secondary content="Load More" onClick={() => action(param)} />
  </div>
);
const isMobile = document.documentElement.clientWidth < 768;
@inject('campaignStore')
@observer
class Offering extends Component {
  constructor(props) {
    super(props);
    this.props.campaignStore.initRequest(['active']).finally(() => {
      this.props.campaignStore.initRequest(['completed'], false, 'completedOfferings');
    });
  }

  render() {
    const {
      active, completed, loading, completedLoading, loadMoreRecord, activeList,
      completedList, activeToDisplay, completedToDisplay, RECORDS_TO_DISPLAY,
    } = this.props.campaignStore;
    return (
      <>
        {/* <Banner /> */}
        {/* <Responsive maxWidth={767} as={Container}>
          <Header as="h2" className="mt-30">
            Invest in growing local businesses
          </Header>
        </Responsive> */}
        <CampaignList
          refLink={this.props.match.url}
          loading={loading}
          campaigns={active}
          filters
          heading={<Header as={isMobile ? 'h3' : 'h2'} textAlign="center" caption className={isMobile ? 'mb-10' : 'mb-50'}>Active Campaigns</Header>}
          subheading={<p className="campaign-subheader center-align">Invest in the growth of the following local businesses</p>}
        />
        {activeList && activeList.length > RECORDS_TO_DISPLAY
          && activeToDisplay < activeList.length
          && <LoadMoreBtn action={loadMoreRecord} param="activeToDisplay" />
        }
        <Divider section hidden />
        <Divider hidden />
        <section className="bg-offwhite">
          <Container textAlign="center">
            <Header as={isMobile ? 'h3' : 'h2'}>Be the first to know about new opportunities</Header>
            <p className="mb-30">
              Sign up to have exclusive investment opportunities delivered straight to your inbox.
            </p>
            <SubscribeForNewsletter className="public-form" />
          </Container>
        </section>
        {!loading
          && (
            <CampaignList
              isFunded
              loading={completedLoading}
              campaigns={completed}
              locked={3}
              heading={<Header as={isMobile ? 'h3' : 'h2'} textAlign="center" caption className={isMobile ? 'mb-10' : 'mb-50'}>Successfully Funded on NextSeed</Header>}
            />
          )
        }
        {!loading && completedList && completedList.length > RECORDS_TO_DISPLAY
          && completedToDisplay < completedList.length
          && <LoadMoreBtn action={loadMoreRecord} param="completedToDisplay" />
        }
        <Divider section hidden />
        <Divider hidden />
      </>
    );
  }
}

export default Offering;
