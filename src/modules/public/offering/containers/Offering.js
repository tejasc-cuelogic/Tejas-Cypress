import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { Header, Container, Button, Divider } from 'semantic-ui-react';
// import Banner from '../components/Banner';
import CampaignList from '../components/listing/CampaignList';
import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';

const isMobile = document.documentElement.clientWidth < 768;
const LoadMoreBtn = ({ action, param }) => (
  <div className={`${isMobile ? 'mb-30' : 'mb-50'} center-align`} data-cy={param}>
    <Button secondary content="View More" onClick={() => action(param)} />
  </div>
);
@inject('campaignStore', 'userStore')
@observer
class Offering extends Component {
  constructor(props) {
    super(props);
    this.props.campaignStore.initRequest(['active']).finally(() => {
      const access = this.props.userStore.myAccessForModule('OFFERINGS');
      const isCreationAllow = this.props.userStore.isAdmin && !isEmpty(access);
      this.props.campaignStore.initRequest(isCreationAllow ? ['creation', 'completed'] : ['completed'], false, 'completedOfferings');
    });
  }

  render() {
    const {
      active, creation, completed, loading, completedLoading, loadMoreRecord, activeList,
      completedList, activeToDisplay, completedToDisplay, RECORDS_TO_DISPLAY,
    } = this.props.campaignStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const showCreationList = this.props.userStore.isAdmin && !isEmpty(access);
    return (
      <>
        {/* <Banner /> */}
        {/* <Responsive maxWidth={767} as={Container}>
          <Header as="h2" className="mt-30">
            Invest in growing local businesses
          </Header>
        </Responsive> */}
        {(showCreationList && !loading)
        && (
          <CampaignList
            refLink={this.props.match.url}
            loading={completedLoading}
            campaigns={creation}
            filters
            heading={<Header as={isMobile ? 'h3' : 'h2'} textAlign="center" caption className={isMobile ? 'mb-10' : 'mb-50'}>Coming Soon</Header>}
            subheading={<p className="campaign-subheader center-align">These offerings are in Creation</p>}
          />
        )}
        <CampaignList
          refLink={this.props.match.url}
          loading={loading}
          campaigns={active}
          filters
          heading={<Header as={isMobile ? 'h3' : 'h2'} textAlign="center" caption className={isMobile ? 'mb-10' : 'mb-50'}>Active Campaigns</Header>}
          subheading={<p className="campaign-subheader center-align">Invest in the growth of the following {isMobile ? <br /> : ''} local businesses</p>}
        />
        {activeList && activeList.length > RECORDS_TO_DISPLAY
          && activeToDisplay < activeList.length
          && <LoadMoreBtn action={loadMoreRecord} param="activeToDisplay" />
        }
        <Divider section hidden />
        <Divider hidden />
        <section className="bg-offwhite">
          <Container textAlign="center">
            <Header as={isMobile ? 'h3' : 'h2'}>Be the first to know about {isMobile ? <br /> : ''} new opportunities</Header>
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
              heading={<Header as={isMobile ? 'h3' : 'h2'} textAlign="center" caption className={isMobile ? 'mb-30' : 'mb-50'}>Successfully Funded on NextSeed</Header>}
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
