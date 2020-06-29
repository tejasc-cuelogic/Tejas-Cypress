import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get, camelCase, orderBy, filter } from 'lodash';
import { withRouter, Route } from 'react-router-dom';
import scrollIntoView from 'scroll-into-view';
import { Responsive, Visibility, Container, Grid, Menu, Divider, Button, Icon } from 'semantic-ui-react';
import CollectionHeader from '../components/CollectionHeader';
import CollectionInsights from '../components/CollectionInsights';
import CustomContent from '../../offering/components/campaignDetails/CustomContent';
import CollectionGallery from '../components/CollectionGallery';
import CampaignList from '../../offering/components/listing/CampaignList';
import { InlineLoader, MobileDropDownNav } from '../../../../theme/shared';
import { NavItems } from '../../../../theme/layout/NavigationItems';
import HtmlEditor from '../../../shared/HtmlEditor';
import CollectionMetaTags from '../components/CollectionMetaTags';
import AboutGallery from '../components/AboutGallery';

const LoadMoreBtn = ({ action, param, isMobile }) => (
  <div id="loadMore" className={`${isMobile ? 'mb-20 mt-40' : 'mb-30 mt-30'}`} data-cy={param}>
    <Button fluid={isMobile} color="green" className="link-button" onClick={() => action(param)}>
      View More
      <Icon size="small" className="ns-caret-down" style={{ marginLeft: '5px' }} color="white" />
    </Button>
  </div>
);

const topsAsPerWindowheight = window.innerHeight > 1000 ? 500 : 150;
const offsetValue = document.getElementsByClassName('offering-side-menu mobile-campain-header')[0] && document.getElementsByClassName('offering-side-menu mobile-campain-header')[0].offsetHeight;
@inject('collectionStore', 'uiStore', 'nsUiStore', 'navStore')
@withRouter
@observer
class CollectionDetails extends Component {
  constructor(props) {
    super(props);
    window.addEventListener('scroll', this.handleOnScroll);
  }

  componentDidMount() {
    const { slug } = this.props.match.params;
    this.props.collectionStore.getPublicCollection(slug).catch((err) => {
      let exception = null;
      try {
        exception = JSON.parse(get(err, 'graphQLErrors[0].message'));
        if (get(exception, 'code') === 'COLLECTION_EXCEPTION') {
          this.props.history.push('/communities');
        }
      } catch {
        this.props.history.push('/communities');
      }
    });
    this.processScroll();
  }

  componentDidUpdate() {
    if (!this.props.collectionStore.isLoadMoreClicked) {
      this.processScroll();
    }
    this.props.collectionStore.setFieldValue('isLoadMoreClicked', false);
  }

  componentWillUnmount() {
    this.props.navStore.setFieldValue('currentActiveHash', null);
    window.removeEventListener('scroll', this.handleOnScroll);
    this.props.collectionStore.resetDisplayCounts();
  }

  scrollToActiveOfferings = () => {
    document.querySelector('#offeringsShow').scrollIntoView({
      block: 'start',
    });
  }

  scrollAndLoad = (type) => {
    const { setFieldValue, loadMoreRecord } = this.props.collectionStore;
    setFieldValue('isLoadMoreClicked', true);
    this.props.navStore.setFieldValue('currentActiveHash', null);
    window.removeEventListener('scroll', this.handleOnScroll);
    loadMoreRecord(type);
    window.addEventListener('scroll', this.handleOnScroll);
  }

  onScrollCallBack = (target) => {
    let returnVal = false;
    if (target && target.classList) {
      returnVal = target.classList.contains('campaign-mobile-menu-v2');
    }
    return returnVal;
  }

  handleOnScroll = () => {
    const { collectionDetails } = this.props.collectionStore;
    const { responsiveVars } = this.props.uiStore;
    const { isTablet } = responsiveVars;
    const navs = [];
    let content = get(collectionDetails, 'marketing.content') || [];
    if (get(content, '[0]')) {
      content = orderBy(filter(content, con => con.scope !== 'HIDDEN'), c => c.order, ['ASC']);
      content.forEach(c => navs.push({ ...c, title: c.title, to: `#${camelCase(c.title)}`, useRefLink: true }));
    }
    if (navs && Array.isArray(navs)) {
      navs.forEach((item) => {
        if (document.getElementById(item.to.slice(1))
          && document.getElementById(item.to.slice(1)).getBoundingClientRect().top < topsAsPerWindowheight
          && document.getElementById(item.to.slice(1)).getBoundingClientRect().top > -1) {
          if (isTablet && (this.props.navStore.currentActiveHash !== item.to) && this.props.navStore.campaignHeaderStatus) {
            scrollIntoView(document.getElementById(`${item.to.slice(1)}-mob-nav`), { align: { top: 1, topOffset: -(window.innerHeight - 92) }, isScrollable: this.onScrollCallBack });
          }
          this.props.navStore.setFieldValue('currentActiveHash', item.to);
        }
      });
    }
  }

  processScroll = () => {
    if (this.props.location.hash && this.props.location.hash !== '' && document.querySelector(`${this.props.location.hash}`)) {
      this.props.navStore.setFieldValue('currentActiveHash', null);
      const { hash } = this.props.location;
      document.querySelector(`${hash}`).scrollIntoView({
        block: 'start',
        // behavior: 'smooth',
      });
    }
  }

  handleUpdate = (e, { calculations }) => {
    this.props.navStore.setMobileNavStatus(calculations);
  }

  render() {
    const { collectionStore, uiStore, nsUiStore, location, match } = this.props;
    const { loadingArray } = nsUiStore;
    const { collectionDetails, getInsightsList, getGalleryImages, getPastOfferingsList, getActiveOfferingsList, activeOfferingList, RECORDS_TO_DISPLAY, activeToDisplay, pastOfferingToDisplay, pastOfferingsList } = collectionStore;
    const { responsiveVars } = uiStore;
    const { isTablet, isMobile } = responsiveVars;
    const collectionHeader = get(collectionDetails, 'marketing.header');
    let content = get(collectionDetails, 'marketing.content') || [];
    const getNotHiddenActiveOfferingsList = filter(content, con => con.contentType === 'ACTIVE_INVESTMENTS' && con.scope !== 'HIDDEN');
    if (loadingArray.includes('getCollection')) {
      return <InlineLoader />;
    }
    const validate = (con) => {
      let isValid = false;
      if (con.contentType === 'ACTIVE_INVESTMENTS' && getActiveOfferingsList && getActiveOfferingsList.length) {
        isValid = true;
      } else if (con.contentType === 'COMPLETE_INVESTMENTS' && getPastOfferingsList && getPastOfferingsList.length) {
        isValid = true;
      } else if (con.contentType === 'INSIGHTS' && getInsightsList && getInsightsList.length) {
        isValid = true;
      } else if (con.contentType === 'GALLERY' && getGalleryImages && getGalleryImages.length) {
        isValid = true;
      } else if (con.contentType === 'CUSTOM' && con.customValue) {
        isValid = true;
      }
      return isValid;
    };
    const navItems = [];
    if (get(content, '[0]')) {
      content = orderBy(filter(content, con => con.scope !== 'HIDDEN'), c => c.order, ['ASC']);
      content.forEach((c, i) => validate(c) && navItems.push({ ...c, title: c.title, to: `#${camelCase(c.title)}`, useRefLink: true, defaultActive: i === 0 }));
    }

    const backToTop = { title: <>Back to Top {<Icon className="ns-chevron-up icon" size="small" />}</>, to: '' };
    navItems.push(backToTop);

    const renderHeading = (contentData) => {
      if (contentData) {
        return <p className="mb-30"><HtmlEditor readOnly content={contentData} /></p>;
      }
      return null;
    };
    const collectionHeaderComponent = (<CollectionHeader activeOfferings={getNotHiddenActiveOfferingsList && getNotHiddenActiveOfferingsList.length} scrollToActiveOfferings={this.scrollToActiveOfferings} data={collectionHeader} />);
    return (
      <>
        {collectionDetails
          && <CollectionMetaTags collection={collectionDetails} getOgDataFromSocial={this.getOgDataFromSocial} />
        }
        {!isMobile && !isTablet && collectionHeaderComponent}
        <div className={`slide-down ${location.pathname.split('/')[2]}`}>
          <Responsive maxWidth={991} as={React.Fragment}>
            <Visibility offset={[offsetValue, 98]} onUpdate={this.handleUpdate} continuous>
              {collectionHeaderComponent}
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
                {!isMobile && !isTablet
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
                <Grid.Column computer={11} mobile={16} className="left-align pl-0 pr-0 offer-details-v2 collection-detail">
                  {content.map((c, i) => (
                    c.contentType === 'ACTIVE_INVESTMENTS' && getActiveOfferingsList && getActiveOfferingsList.length
                      ? (
                        <>
                          {i !== 0 && <Divider hidden section />}
                          <div className={`${i !== 0 ? 'mt-40' : 'mt-20'} anchor-wrap`}><span id="offeringsShow" className="anchor" /><span className="anchor" id={camelCase(c.title)} /></div>
                          <CampaignList
                            collection
                            refLink={this.props.match.url}
                            loading={loadingArray.includes('getCollectionMapping')}
                            campaigns={activeOfferingList}
                            heading={renderHeading(get(c, 'description'))}
                            loadMoreButton={(
                              <>
                                {getActiveOfferingsList && getActiveOfferingsList.length > RECORDS_TO_DISPLAY
                                  && activeToDisplay < getActiveOfferingsList.length
                                  && <LoadMoreBtn action={this.scrollAndLoad} param="activeToDisplay" />
                                }
                              </>
                            )}
                          />
                        </>
                      ) : c.contentType === 'COMPLETE_INVESTMENTS' && getPastOfferingsList && getPastOfferingsList.length
                        ? (
                          <>
                            {i !== 0 && <Divider hidden section />}
                            <div className={`${i !== 0 ? 'mt-40' : 'mt-20'} anchor-wrap`}><span className="anchor" id={camelCase(c.title)} /></div>
                            <CampaignList
                              collection
                              isFunded
                              refLink={this.props.match.url}
                              loading={loadingArray.includes('getCollectionMapping')}
                              campaigns={pastOfferingsList}
                              heading={renderHeading(get(c, 'description'))}
                              loadMoreButton={(
                                <>
                                  {getPastOfferingsList && getPastOfferingsList.length > RECORDS_TO_DISPLAY
                                    && pastOfferingToDisplay < getPastOfferingsList.length
                                    && <LoadMoreBtn action={this.scrollAndLoad} param="pastOfferingToDisplay" />
                                  }
                                </>
                              )}
                            />
                          </>
                        ) : c.contentType === 'INSIGHTS' && getInsightsList && getInsightsList.length
                          ? (
                            <>
                              {i !== 0 && <Divider hidden section />}
                              <div className={`${i !== 0 ? 'mt-40' : 'mt-20'} anchor-wrap`}><span className="anchor" id={camelCase(c.title)} /></div>
                              <CollectionInsights
                                heading={renderHeading(get(c, 'description'))}
                                loading={loadingArray.includes('getCollectionMapping')}
                                InsightArticles={getInsightsList}
                              />
                            </>
                          ) : c.contentType === 'GALLERY'
                            ? (
                              <CollectionGallery
                                galleryImages={getGalleryImages}
                                processScroll={this.processScroll}
                                newLayout
                                galleryUrl={this.props.match.url}
                                title={c.title}
                              />
                            ) : c.contentType === 'CUSTOM' && c.customValue
                              ? (
                                <>
                                  {i !== 0 && <Divider hidden section />}
                                  <div className={`${i !== 0 ? 'mt-40' : 'mt-20'} anchor-wrap`}><span className="anchor" id={camelCase(c.title)} /></div>
                                  <CustomContent content={c.customValue} isTablet={isTablet} isMobile={isMobile} />
                                </>
                              )
                              : null
                  ))}
                </Grid.Column>
              </Grid>
            </section>
            <Route path={`${this.props.match.url}/photogallery`} component={AboutGallery} />
          </Container>
        </div>
      </>
    );
  }
}

export default CollectionDetails;
