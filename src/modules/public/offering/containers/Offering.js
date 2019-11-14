import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Container, Button } from 'semantic-ui-react';
// import Banner from '../components/Banner';
import CampaignList from '../components/listing/CampaignList';
import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';

const isMobile = document.documentElement.clientWidth < 768;
const LoadMoreBtn = ({ action, param }) => (
  <div className={`${isMobile ? 'mb-20 mt-40' : 'mb-30 mt-80'} center-align`} data-cy={param}>
    <Button fluid={isMobile} secondary content="View More" onClick={() => action(param)} />
  </div>
);
@inject('campaignStore', 'uiStore')
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
    const { responsiveVars } = this.props.uiStore;
    return (
      <>
        <CampaignList
          refLink={this.props.match.url}
          loading={loading}
          campaigns={active}
          filters
          heading={<Header as={responsiveVars.isMobile ? 'h3' : 'h2'} textAlign={responsiveVars.isMobile ? '' : 'center'} caption className={responsiveVars.isMobile ? 'mb-20 mt-20' : 'mt-50 mb-30'}>Active Campaigns</Header>}
          subheading={<p className={responsiveVars.isMobile ? 'mb-40' : 'center-align mb-80'}>Browse the newest investment opportunities on NextSeed. {!responsiveVars.isMobile && <br /> }The next big thing may be inviting you to participate.</p>}
          loadMoreButton={(
            <>
            {activeList && activeList.length > RECORDS_TO_DISPLAY
              && activeToDisplay < activeList.length
              && <LoadMoreBtn action={loadMoreRecord} param="activeToDisplay" />
            }
            </>
          )}
        />
        <section className="bg-offwhite">
          <Container textAlign={responsiveVars.isMobile ? '' : 'center'} className="mb-20 mt-20">
            <Header as="h2">Never miss an opportunity</Header>
            <p className="mb-30">
              Sign up to stay informed about new investment opportunities, updates and events.
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
              heading={<Header as={responsiveVars.isMobile ? 'h3' : 'h2'} textAlign={responsiveVars.isMobile ? '' : 'center'} caption className={responsiveVars.isMobile ? 'mb-20 mt-20' : 'mt-50 mb-60'}>Successfully Funded on NextSeed</Header>}
              loadMoreButton={(
                <>
                {!loading && completedList && completedList.length > RECORDS_TO_DISPLAY
                  && completedToDisplay < completedList.length
                  && <LoadMoreBtn action={loadMoreRecord} param="completedToDisplay" />
                }
                </>
              )}
            />
          )
        }
      </>
    );
  }
}

export default Offering;
