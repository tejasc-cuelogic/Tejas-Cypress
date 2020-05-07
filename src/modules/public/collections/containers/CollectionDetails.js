/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { find, get, filter, camelCase, orderBy } from 'lodash';
import { withRouter } from 'react-router-dom';
import { Header, Responsive, Visibility, Container, Grid, Menu } from 'semantic-ui-react';
import CollectionHeader from '../components/CollectionHeader';
import CollectionInsights from '../components/CollectionInsights';
import CustomContent from '../../offering/components/campaignDetails/CustomContent';
import CampaignList from '../../offering/components/listing/CampaignList';
import { InlineLoader, MobileDropDownNav } from '../../../../theme/shared';
import { NavItems } from '../../../../theme/layout/NavigationItems';

const offsetValue = document.getElementsByClassName('offering-side-menu mobile-campain-header')[0] && document.getElementsByClassName('offering-side-menu mobile-campain-header')[0].offsetHeight;
@inject('collectionStore', 'uiStore', 'nsUiStore')
@withRouter
@observer
class CollectionDetails extends Component {
  componentDidMount() {
    const { slug } = this.props.match.params;
    this.props.collectionStore.getPublicCollection(slug);
    this.processScroll();
  }

  scrollToActiveOfferings = () => {
    document.querySelector('#offeringsShow').scrollIntoView({
      block: 'start',
    });
  }

  processScroll = () => {
    if (this.props.location.hash && this.props.location.hash !== '' && document.querySelector(`${this.props.location.hash}`)) {
      this.props.navStore.setFieldValue('currentActiveHash', null);
      document.querySelector(`${this.props.location.hash}`).scrollIntoView({
        block: 'start',
        // behavior: 'smooth',
      });
    }
  }

  render() {
    const { collectionStore, uiStore, nsUiStore, location, match } = this.props;
    const { loadingArray } = nsUiStore;
    const { collectionDetails, getInsightsList, getPastOfferingsList, getActiveOfferingsList } = collectionStore;
    const { responsiveVars } = uiStore;
    const { isTablet, isMobile } = responsiveVars;
    const collectionHeader = get(collectionDetails, 'marketing.header');
    const activeInvestment = find((get(collectionDetails, 'marketing.content') || []), c => c.contentType === 'ACTIVE_INVESTMENTS');
    const completedInvestment = find((get(collectionDetails, 'marketing.content') || []), c => c.contentType === 'COMPLETE_INVESTMENTS');
    const collectionInsight = find((get(collectionDetails, 'marketing.content') || []), c => c.contentType === 'INSIGHTS');
    const customContent = filter((get(collectionDetails, 'marketing.content') || []), c => c.contentType === 'CUSTOM');
    let content = get(collectionDetails, 'marketing.content') || [];
    if (loadingArray.includes('getCollection')) {
      return <InlineLoader />;
    }
    const navItems = [];
    if (get(content, '[0]')) {
      content = orderBy(content, c => c.order, ['ASC']);
      content.forEach((c, i) => navItems.push({ ...c, title: c.title, to: `#${camelCase(c.title)}`, useRefLink: true, defaultActive: i === 0 }));
    }
    // const navItems = [{
    //   title: 'History', to: '#history', useRefLink: true, key: 'history',
    // },
    // {
    //   title: 'The Team', to: '#team', useRefLink: true, key: 'team',
    // },
    // {
    //   title: 'Bonus Rewards', to: '#bonus-rewards', useRefLink: true, key: 'isBonusReward',
    // },
    // {
    //   title: 'Gallery', to: '#gallery', useRefLink: true, key: 'gallery',
    // },
    // {
    //   title: 'Documents', to: '#data-room', useRefLink: true, key: 'dataRooms',
    // }];
    return (
      <>
        {!isMobile && <CollectionHeader scrollToActiveOfferings={this.scrollToActiveOfferings} data={collectionHeader} />}
        <div className={`slide-down ${location.pathname.split('/')[2]}`}>
          <Responsive maxWidth={991} as={React.Fragment}>
            <Visibility offset={[offsetValue, 98]} onUpdate={this.handleUpdate} continuous>
              <CollectionHeader scrollToActiveOfferings={this.scrollToActiveOfferings} data={collectionHeader} />
              <MobileDropDownNav
                inverted
                refMatch={match}
                // navCountData={navCountData}
                navItems={navItems}
                location={location}
                useIsActive
                newLayout
                className="campaign-mobile-dropdown"
              />
            </Visibility>
          </Responsive>
          <Container>
            <section>
              <Grid centered>
                {!isMobile
                  && (
                    <Grid.Column width={4} className="left-align">
                      <div className={`collapse'} ${isMobile ? 'mobile-campain-header' : 'sticky-sidebar'} offering-layout-menu offering-side-menu `}>
                        <Menu vertical>
                          <NavItems needNavLink sub refLoc="public" refLink={this.props.match.url} location={this.props.location} navItems={navItems} />
                        </Menu>
                      </div>
                    </Grid.Column>
                  )
                }
                <Grid.Column computer={9} mobile={16} className="left-align offer-details-v2">
                  {content.map(c => (
                    c.contentType === 'ACTIVE_INVESTMENTS'
                      ? (
                        <>
                          <span id={camelCase(c.title)} />
                          <CampaignList
                            collection
                            refLink={this.props.match.url}
                            loading={loadingArray.includes('getCollectionMapping')}
                            campaigns={getActiveOfferingsList}
                            heading={get(activeInvestment, 'title') && <Header id="offeringsShowd" as="h2" textAlign={isMobile ? '' : 'center'} caption className={isMobile ? 'mb-20 mt-20' : 'mt-50 mb-30'}>{get(activeInvestment, 'title')}</Header>}
                          />
                        </>
                      ) : c.contentType === 'COMPLETE_INVESTMENTS'
                        ? (
                          <>
                            <span id={camelCase(c.title)} />
                            <CampaignList
                              collection
                              refLink={this.props.match.url}
                              loading={loadingArray.includes('getCollectionMapping')}
                              campaigns={getPastOfferingsList}
                              heading={get(completedInvestment, 'title') && <Header as="h2" textAlign={isMobile ? '' : 'center'} caption className={isMobile ? 'mb-20 mt-20' : 'mt-50 mb-30'}>{get(completedInvestment, 'title')}</Header>}
                            // subheading={<p className={isMobile ? 'mb-40' : 'center-align mb-80'}>Browse the newest investment opportunities on NextSeed. {!isMobile && <br /> }The next big thing may be inviting you to participate.</p>}
                            />
                          </>
                        ) : c.contentType === 'INSIGHTS'
                          ? (
                            <>
                              <span id={camelCase(c.title)} />
                              <CollectionInsights
                                heading={get(collectionInsight, 'title') && <Header as="h2" textAlign={isMobile ? '' : 'center'} caption className={isMobile ? 'mb-20 mt-20' : 'mt-50 mb-30'}>{get(collectionInsight, 'title')}</Header>}
                                loading={loadingArray.includes('getCollectionMapping')}
                                InsightArticles={getInsightsList}
                              />
                            </>
                          )
                          : c.contentType === 'CUSTOM'
                            ? (
                              <>
                                <span id={camelCase(c.title)} />
                                <CustomContent title={c.title} content={c.customValue} isTablet={isTablet} />
                              </>
                            )
                            : null
                  ))}
                </Grid.Column>
              </Grid>
            </section>
          </Container>
        </div>
      </>
    );
  }
}

export default CollectionDetails;
