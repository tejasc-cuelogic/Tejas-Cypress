import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { Header, Container, Button, Grid, Responsive, Divider, Icon } from 'semantic-ui-react';
// import NSImage from '../../../shared/NSImage';
// import Banner from '../components/Banner';
import CampaignList from '../components/listing/CampaignList';
import CollectionsList from '../../collections/components/CollectionsList';
import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';

// const isMobile = document.documentElement.clientWidth < 768;
const LoadMoreBtn = ({ action, param, isMobile }) => (
  <div className={`${isMobile ? 'mb-20 mt-40' : 'mb-30 mt-80'} center-align`} data-cy={param}>
    <Button fluid={isMobile} primary basic content="View More" onClick={() => action(param)} />
  </div>
);

// const NsCapital = ({ nsCapitalMeta, isMobile, isTablet }) => (
//   <section key={nsCapitalMeta.title} className={`${isMobile || isTablet ? 'pt-0 pb-50' : 'pt-40 pb-100'} bg-white`}>
//     <Container>
//       <Grid>
//         {!isMobile && !isTablet
//             && (
//               <Grid.Column widescreen={7} computer={7} tablet={16} mobile={16} floated={!isMobile ? 'left' : ''}>
//                 <Header as="h2" className="mb-40 left-align">{nsCapitalMeta.title}</Header>
//                 <p className="mb-30 mt-30">{nsCapitalMeta.description}</p>
//                 <Button className="mt-30" as={Link} to="/capital" primary content="Learn More" />
//               </Grid.Column>
//             )
//           }
//           {isMobile || isTablet
//             ? (
//               <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16} className="pt-0" floated={!isMobile ? 'right' : ''}>
//                 <Header as="h2" className="left-align">{nsCapitalMeta.title}</Header>
//                 <p className="mb-30 mt-10">{nsCapitalMeta.date}</p>
//                 <p className="mb-30 mt-30">{nsCapitalMeta.description}</p>
//                 <NSImage className="mb-30" path={nsCapitalMeta.image} fluid />
//                 <Button className="mt-30" as={Link} to="/capital" primary fluid content="Learn More" />
//               </Grid.Column>
//             )
//             : (
//               <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16} floated={!isMobile ? 'right' : ''}>
//                 <NSImage path={nsCapitalMeta.image} fluid />
//               </Grid.Column>
//             )
//           }
//       </Grid>
//     </Container>
//   </section>
// );

@inject('campaignStore', 'userStore', 'uiStore', 'collectionStore')
@observer
class Offering extends Component {
  constructor(props) {
    super(props);
    this.props.collectionStore.getCollections();
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
    const { getCollectionLength } = this.props.collectionStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const showCreationList = this.props.userStore.isAdmin && !isEmpty(access);
    const { responsiveVars } = this.props.uiStore;
    const { isMobile } = responsiveVars;
    // const nsCapitalMeta = {
    //   title: 'NextSeed Capital',
    //   date: 'Launching in 2020',
    //   image: 'group/ns-capital.jpg',
    //   disclosure: 'NextSeed Capital and NextSeed Special Situations Local Business Fund have not yet been registered and the fund terms not yet finalized. Final terms and documents will be made available to qualified investors only once finalized and registered, as applicable.',
    //   description: 'NextSeed Capital will invest directly, via flexible debt and equity capital, into small businesses that are vital to their communities. These funds will provide qualified investors the opportunity to gain direct, diversified exposure to local businesses that provide positive hyper-local impact.',
    // };
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
        {getCollectionLength
        ? (
         <>
          <CollectionsList collectionLength={3} offering />
          <Divider section hidden />
          </>
         ) : null
        }
        {/* <NsCapital isMobile={isMobile} isTablet={isTablet} nsCapitalMeta={nsCapitalMeta} responsiveVars={responsiveVars} /> */}
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
            && <LoadMoreBtn isMobile={isMobile} action={loadMoreRecord} param="creationToDisplay" />
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
