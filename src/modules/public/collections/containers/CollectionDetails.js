import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get, camelCase, orderBy } from 'lodash';
import { withRouter } from 'react-router-dom';
import scrollIntoView from 'scroll-into-view';
import { Responsive, Visibility, Container, Grid, Menu, Divider } from 'semantic-ui-react';
import CollectionHeader from '../components/CollectionHeader';
import CollectionInsights from '../components/CollectionInsights';
import CustomContent from '../../offering/components/campaignDetails/CustomContent';
import CampaignList from '../../offering/components/listing/CampaignList';
import { InlineLoader, MobileDropDownNav } from '../../../../theme/shared';
import { NavItems } from '../../../../theme/layout/NavigationItems';
import HtmlEditor from '../../../shared/HtmlEditor';

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
    this.props.collectionStore.getPublicCollection(slug);
    this.processScroll();
  }

  componentDidUpdate() {
    this.processScroll();
  }

  componentWillUnmount() {
    this.props.navStore.setFieldValue('currentActiveHash', null);
    window.removeEventListener('scroll', this.handleOnScroll);
  }

  scrollToActiveOfferings = () => {
    document.querySelector('#offeringsShow').scrollIntoView({
      block: 'start',
    });
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
      content = orderBy(content, c => c.order, ['ASC']);
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
      document.querySelector(`${this.props.location.hash}`).scrollIntoView({
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
    const { collectionDetails, getInsightsList, getPastOfferingsList, getActiveOfferingsList } = collectionStore;
    const { responsiveVars } = uiStore;
    const { isTablet, isMobile } = responsiveVars;
    const collectionHeader = get(collectionDetails, 'marketing.header');
    let content = get(collectionDetails, 'marketing.content') || [];
    if (loadingArray.includes('getCollection')) {
      return <InlineLoader />;
    }
    const navItems = [];
    if (get(content, '[0]')) {
      content = orderBy(content, c => c.order, ['ASC']);
      content.forEach((c, i) => navItems.push({ ...c, title: c.title, to: `#${camelCase(c.title)}`, useRefLink: true, defaultActive: i === 0 }));
    }
    const renderHeading = (contentData) => {
      if (contentData) {
        return <p className="mb-30"><HtmlEditor readOnly content={contentData} /></p>;
      }
      return null;
    };
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
                  {content.map((c, i) => (
                    c.contentType === 'ACTIVE_INVESTMENTS' && getActiveOfferingsList & getActiveOfferingsList.length
                      ? (
                        <>
                          <span id="offeringsShow" />
                          <span id={camelCase(c.title)} />
                          {i !== 0 && <Divider hidden section />}
                          <CampaignList
                            collection
                            refLink={this.props.match.url}
                            loading={loadingArray.includes('getCollectionMapping')}
                            campaigns={getActiveOfferingsList}
                            heading={renderHeading(get(c, 'description'))}
                          />
                        </>
                      ) : c.contentType === 'COMPLETE_INVESTMENTS' && getPastOfferingsList && getPastOfferingsList.length
                        ? (
                          <>
                            <span id={camelCase(c.title)} />
                            {i !== 0 && <Divider hidden section />}
                            <CampaignList
                              collection
                              refLink={this.props.match.url}
                              loading={loadingArray.includes('getCollectionMapping')}
                              campaigns={getPastOfferingsList}
                              heading={renderHeading(get(c, 'description'))}
                            />
                          </>
                        ) : c.contentType === 'INSIGHTS' && getInsightsList && getInsightsList.length
                          ? (
                            <>
                              <span id={camelCase(c.title)} />
                              {i !== 0 && <Divider hidden section />}
                              {i !== 0 && <Divider hidden section />}
                              <CollectionInsights
                                heading={renderHeading(get(c, 'description'))}
                                loading={loadingArray.includes('getCollectionMapping')}
                                InsightArticles={getInsightsList}
                              />
                            </>
                          )
                          : c.contentType === 'CUSTOM' && c.customValue
                            ? (
                              <>
                                <span id={camelCase(c.title)} />
                                {i !== 0 && <Divider hidden section />}
                                {i !== 0 && <Divider hidden section />}
                                <CustomContent content={c.customValue} isTablet={isTablet} />
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
