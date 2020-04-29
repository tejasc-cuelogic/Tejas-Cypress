import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { Header, Container, Button, Grid, Responsive, Divider, Icon } from 'semantic-ui-react';
// import Banner from '../components/Banner';
import CampaignList from '../components/listing/CampaignList';
import CollectionsList from '../../collections/components/CollectionsList';
import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';

const isMobile = document.documentElement.clientWidth < 768;
const LoadMoreBtn = ({ action, param }) => (
  <div className={`${isMobile ? 'mb-20 mt-40' : 'mb-30 mt-80'} center-align`} data-cy={param}>
    <Button fluid={isMobile} primary basic content="View More" onClick={() => action(param)} />
  </div>
);
@inject('campaignStore', 'userStore', 'uiStore')
@observer
class Offering extends Component {
  constructor(props) {
    super(props);
    this.props.campaignStore.setFieldValue('isPostedNewComment', false);
    this.props.campaignStore.initRequest('LIVE').finally(() => {
      const access = this.props.userStore.myAccessForModule('OFFERINGS');
      const isCreationAllow = this.props.userStore.isAdmin && !isEmpty(access);
      this.props.campaignStore.initRequest(isCreationAllow ? ['creation', 'completed'] : 'COMPLETE', false, 'completedOfferings');
    });
  }

  hideCreationList = () => {
    this.props.campaignStore.setFieldValue('hideCreationList', true);
  }

  render() {
    const {
      orderedActiveList, creation, creationList, creationToDisplay, completed, loading, completedLoading, loadMoreRecord, completedList, completedToDisplay, RECORDS_TO_DISPLAY, hideCreationList,
    } = this.props.campaignStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const showCreationList = this.props.userStore.isAdmin && !isEmpty(access);
    const { responsiveVars } = this.props.uiStore;
    return (
      <>
        <CampaignList
          refLink={this.props.match.url}
          loading={loading}
          campaigns={orderedActiveList}
          filters
          heading={<Header as="h2" textAlign={responsiveVars.isMobile ? '' : 'center'} caption className={responsiveVars.isMobile ? 'mb-20 mt-20' : 'mt-50 mb-30'}>Active Campaigns</Header>}
          subheading={<p className={responsiveVars.isMobile ? 'mb-40' : 'center-align mb-80'}>Browse the newest investment opportunities on NextSeed. {!responsiveVars.isMobile && <br /> }The next big thing may be inviting you to participate.</p>}
        />
        <Divider section hidden />
        <CollectionsList />
        <Divider section hidden />
        {(!hideCreationList && showCreationList && !loading)
        && (
          <>
          <Divider section as={Container} />
          <CampaignList
            refLink={this.props.match.url}
            loading={completedLoading}
            campaigns={creation}
            filters
            heading={<Header as={isMobile ? 'h3' : 'h2'} textAlign="center" caption className={`${isMobile ? 'mb-10' : 'mb-50'} coming-soon-header`}>Coming Soon<Icon className="ns-offer-declined" onClick={this.hideCreationList} /></Header>}
            subheading={<p className="campaign-subheader center-align">These offerings are in Creation</p>}
          />
          {creationList && creationList.length > 6
            && creationToDisplay < creationList.length
            && <LoadMoreBtn action={loadMoreRecord} param="creationToDisplay" />
          }
           <Divider hidden section as={Container} />
           <Divider hidden section as={Container} />
          </>
        )}
        <Divider as={Container} fitted />
        <section>
          <Container className={responsiveVars.isMobile ? 'mb-10 mt-0' : 'mb-60 mt-60'}>
            <Grid columns={2} stackable>
              <Grid.Column>
                <Header as="h2" className={responsiveVars.isMobile ? 'mt-0 mb-10' : 'mb-20'}>Never miss an opportunity</Header>
                <p>
                  Sign up to stay informed about new investment<Responsive minWidth={768} as="br" /> opportunities, updates and events.
                </p>
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <SubscribeForNewsletter className="public-form" />
              </Grid.Column>
            </Grid>
          </Container>
        </section>
        <Divider as={Container} fitted />
        {!loading
          && (
            <CampaignList
              isFunded
              loading={completedLoading}
              campaigns={completed}
              locked={3}
              heading={<Header as="h2" textAlign={responsiveVars.isMobile ? '' : 'center'} caption className={responsiveVars.isMobile ? 'mb-20 mt-20' : 'mt-50 mb-60'}>Successfully Funded Campaigns</Header>}
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
