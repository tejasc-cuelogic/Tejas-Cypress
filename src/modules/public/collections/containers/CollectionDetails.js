import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get, camelCase, orderBy, find } from 'lodash';
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
import CollectionMetaTags from '../components/CollectionMetaTags';


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

  state = { firstHash: '' };

  componentDidMount() {
    const { slug } = this.props.match.params;
    this.props.collectionStore.getPublicCollection(slug).catch((err) => {
      let exception = null;
      try {
        exception = JSON.parse(get(err, 'graphQLErrors[0].message'));
        if (get(exception, 'code') === 'COLLECTION_EXCEPTION') {
          this.props.history.push('/collections-testing');
        }
      } catch {
        this.props.history.push('/collections-testing');
      }
    });
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
      const hash = this.state.firstHash === this.props.location.hash ? '#firstContent' : this.props.location.hash;
      document.querySelector(`${hash}`).scrollIntoView({
        block: 'start',
        // behavior: 'smooth',
      });
    }
  }

  handleUpdate = (e, { calculations }) => {
    this.props.navStore.setMobileNavStatus(calculations);
  }

  getOgDataFromSocial = (obj, type, att) => {
    const data = find(obj, o => o.type === type);
    return get(data, att) || '';
  };


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
    const validate = (con) => {
      let isValid = false;
      if (con.contentType === 'ACTIVE_INVESTMENTS' && getActiveOfferingsList && getActiveOfferingsList.length) {
        isValid = true;
      } else if (con.contentType === 'COMPLETE_INVESTMENTS' && getPastOfferingsList && getPastOfferingsList.length) {
        isValid = true;
      } else if (con.contentType === 'INSIGHTS' && getInsightsList && getInsightsList.length) {
        isValid = true;
      } else if (con.contentType === 'CUSTOM' && con.customValue) {
        isValid = true;
      }
      return isValid;
    };
    const navItems = [];
    if (get(content, '[0]')) {
      content = orderBy(content, c => c.order, ['ASC']);
      content.forEach((c, i) => validate(c) && navItems.push({ ...c, title: c.title, to: `#${camelCase(c.title)}`, useRefLink: true, defaultActive: i === 0 }));
    }
    if (navItems.length && this.state.firstHash === '') {
      this.setState({ firstHash: get(navItems, '[0].to') });
    }
    const renderHeading = (contentData) => {
      if (contentData) {
        return <p className="mb-30"><HtmlEditor readOnly content={contentData} /></p>;
      }
      return null;
    };
    const collectionHeaderComponent = (<CollectionHeader activeOffering={getActiveOfferingsList && getActiveOfferingsList.length} scrollToActiveOfferings={this.scrollToActiveOfferings} data={collectionHeader} />);
    return (
      <>
        {collectionDetails
          && <CollectionMetaTags collection={collectionDetails} getOgDataFromSocial={this.getOgDataFromSocial} />
        }
        {!isMobile && collectionHeaderComponent}
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
            <span id="firstContent" />
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
                    c.contentType === 'ACTIVE_INVESTMENTS' && getActiveOfferingsList && getActiveOfferingsList.length
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
                              {/* {i !== 0 && <Divider hidden section />} */}
                              <section>
                                <CollectionInsights
                                  heading={renderHeading(get(c, 'description'))}
                                  loading={loadingArray.includes('getCollectionMapping')}
                                  InsightArticles={getInsightsList}
                                />
                              </section>
                            </>
                          )
                          : c.contentType === 'CUSTOM' && c.customValue
                            ? (
                              <>
                                <span id={camelCase(c.title)} />
                                {i !== 0 && <Divider hidden section />}
                                {/* {i !== 0 && <Divider hidden section />} */}
                                <section>
                                  <CustomContent content={c.customValue} isTablet={isTablet} />
                                </section>
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
