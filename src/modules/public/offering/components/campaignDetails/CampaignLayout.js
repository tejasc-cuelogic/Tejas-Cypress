import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { orderBy, get } from 'lodash';
import moment from 'moment';
import { Route } from 'react-router-dom';
import { toJS } from 'mobx';
import scrollIntoView from 'scroll-into-view';
import { Divider, Button, Icon } from 'semantic-ui-react';
import AboutTheCompany from './Overview/AboutTheCompany';
import InvestmentDetails from './InvestmentDetails';
import AboutCompany from './AboutCompany';
import LatestUpdates from './Overview/LatestUpdates';
import Updates from './Updates';
import VideoModal from './Overview/VideoModal';
// import TotalPaymentCalculator from './investmentDetails/totalPaymentCalculator';
import RevenueSharingSummary from './investmentDetails/revenueSharingSummary';
import AboutPhotoGallery from './AboutPhotoGallery';
import Gallery from './AboutCompany/Gallery';
import IssuerStatement from './Overview/IssuerStatement';
import BonusRewards from './BonusRewards';
import Documents from './documents';
import Comments from './Comments';
import CampaignTemplate2 from './CampaignTemplate2';
import Helper from '../../../../../helper/utility';

const isTabletLand = document.documentElement.clientWidth >= 992
  && document.documentElement.clientWidth < 1200;
const topsAsPerWindowheight = window.innerHeight > 1000 ? 500 : 150;
const isTablet = document.documentElement.clientWidth < 992;
// const isMobile = document.documentElement.clientWidth < 992;
window.scrollme = scrollIntoView;

@inject('campaignStore', 'navStore')
@observer
class CampaignLayout extends Component {
  state = {
    expandUpdate: false,
    expandComments: false,
  }

  constructor(props) {
    super(props);
    window.addEventListener('scroll', this.handleOnScroll);
  }

  componentDidMount() {
    try {
      [...document.querySelectorAll('.fr-view')].forEach((e) => {
        [...e.querySelectorAll('img')].forEach((ele) => {
          this.pWrapper(ele);
          ele.setAttribute('data-src', ele.getAttribute('src'));
          ele.removeAttribute('src');
          ele.closest('.closest').classList.add('ui');
          ele.closest('.closest').classList.add('placeholder');
        });
        [...e.querySelectorAll('iframe')].forEach((ele) => {
          if (!ele.getAttribute('title')) {
            ele.setAttribute('title', this.props.offeringName || 'Offering');
          }
        });
      });
    } catch (err) {
      window.logger(err);
      window.logger('soft failed for lazyload image', 'warn', true, err);
    }
    this.processScroll();
    Helper.eventListnerHandler('toggleReadMore', 'toggleReadMore');
    this.processLazyLoadImages();
  }

  componentDidUpdate() {
    try {
      [...document.querySelectorAll('.fr-view')].forEach((e) => {
        [...e.querySelectorAll('img')].forEach((ele) => {
          this.pWrapper(ele);
          ele.setAttribute('data-src', ele.getAttribute('src'));
          ele.removeAttribute('src');
          ele.closest('.closest').classList.add('ui');
          ele.closest('.closest').classList.add('placeholder');
        });
      });
    } catch (err) {
      window.logger('soft failed for lazyload image', 'warn', true, err);
    }
    this.processLazyLoadImages();
  }

  componentWillUnmount() {
    this.props.navStore.setFieldValue('currentActiveHash', null);
    window.removeEventListener('scroll', this.handleOnScroll);
    Helper.eventListnerHandler('toggleReadMore', 'toggleReadMore', 'remove');
  }

  pWrapper = (el) => {
    const p = document.createElement('p');
    p.classList.add('closest');
    ['fr-editor-desktop', 'fr-editor-mobile', 'fr-editor-tablet', 'fr-editor-tablet-landscape', 'fr-editor-tablet-mobile'].forEach((e) => {
      if (el.classList.contains(e)) {
        p.classList.add(e);
      }
    });
    el.parentNode.insertBefore(p, el);
    p.appendChild(el);
  }

  onScrollCallBack = (target) => {
    let returnVal = false;
    if (target && target.classList) {
      returnVal = target.classList.contains('campaign-mobile-menu-v2');
    }
    return returnVal;
  }

  isScrolledIntoView = (el) => {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top - 110;
    const elemBottom = rect.bottom;
    // const isVisible = (elemTop >= 0) && ((elemBottom - window.innerHeight) <= window.innerHeight);
    // const isVisible = ((elemBottom <= 0) && ((elemTop - window.innerHeight) <= window.innerHeight)) || ((elemTop >= 0) && ((elemBottom - window.innerHeight) <= window.innerHeight));
    const isVisible = (((elemBottom <= 0) && (elemTop + 200) >= 0) && ((elemBottom - window.innerHeight) <= window.innerHeight)) || ((elemTop >= 0) && ((elemBottom - window.innerHeight) <= window.innerHeight));
    return isVisible;
  }

  processLazyLoadImages = () => new Promise((resolve) => {
    try {
      const ele = [...document.querySelectorAll('.fr-view')];
      ele.forEach((e) => {
        const lazyImages = [...e.querySelectorAll('img')];
        lazyImages.forEach((img, i) => {
          if (this.isScrolledIntoView(img)) {
            setTimeout(() => {
              img.setAttribute('src', img.getAttribute('data-src'));
              img.closest('.closest').classList.remove('ui');
              img.closest('.closest').classList.remove('placeholder');
              if (!img.getAttribute('alt')) {
                img.setAttribute('alt', 'Image not found!');
              }
            }, 500);
          }
          if (i === lazyImages.length - 1) { setTimeout(() => { resolve(); }, 5000); }
        });
      });
    } catch (err) {
      window.logger('soft failed for lazyload image', 'warn', true, err);
    }
  })

  handleOnScroll = () => {
    this.processLazyLoadImages();
    const { campaignNavData, campaignStatus } = this.props.campaignStore;
    let navs = toJS(campaignNavData);
    if (campaignStatus.campaignTemplate === 2) {
      navs = campaignStatus.templateNavs;
    }
    if (navs && Array.isArray(navs)) {
      navs.forEach((item) => {
        if (document.getElementById(item.to.slice(1))
          && document.getElementById(item.to.slice(1)).getBoundingClientRect().top < topsAsPerWindowheight
          && document.getElementById(item.to.slice(1)).getBoundingClientRect().top > -1) {
          if (isTablet && (this.props.navStore.currentActiveHash !== item.to) && this.props.navStore.campaignHeaderStatus) {
            scrollIntoView(document.getElementById(`${item.to.slice(1)}-mob-nav`), { align: { top: 1, topOffset: -(window.innerHeight - 92) }, isScrollable: this.onScrollCallBack });
            // document.getElementsByClassName('campaign-mobile-menu-v2')[0].getElementsByClassName('active')[0].scrollIntoView({
            //   // inline: 'center',
            //   behavior: 'smooth',
            //   // block: 'start',
            // });
          }
          this.props.navStore.setFieldValue('currentActiveHash', item.to);
        }
      });
    }
  }

  handleCollapseExpand = (name, processAction) => {
    this.setState({ [name]: !this.state[name] });
    document.querySelector(processAction).scrollIntoView(true);
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
    const { campaign, campaignStatus, dataRoomDocs, postedCommentCount } = this.props.campaignStore;
    let updates = campaign && campaign.updates;
    updates = orderBy(updates, o => get(o, 'updatedDate') && moment(new Date(o.updatedDate)).unix(), ['asc']);
    // const postedComments = get(campaign, 'comments') || [];
    return (
      <div className="campaign-content-wrapper v-2">
        {get(campaign, 'template') === 2
          ? (
            <CampaignTemplate2
              state={this.state}
              refLink={this.props.match.url}
              isTablet={isTablet}
              isTabletLand={isTabletLand}
              processScroll={this.processScroll}
              handleCollapseExpand={this.handleCollapseExpand}
            />
)
        : (
        <>
          {campaignStatus.hasTopThingToKnow ? (
            <>
              <AboutTheCompany isFund={campaignStatus.isFund} newLayout refLink={this.props.refLink} campaign={campaign} />
              <Divider hidden section />
            </>
          ) : null}
          {/* <KeyTerms refLink={this.props.refLink} campaign={campaign} /> */}
          {campaignStatus.updates !== 0
            && (
              <>
                {this.state.expandUpdate
                  ? <Updates newLayout handleUpdateCollapseExpand={this.handleUpdateCollapseExpand} />
                  : (
                    <LatestUpdates
                      newLayout
                      handleUpdateCollapseExpand={this.handleUpdateCollapseExpand}
                      updates={updates}
                      refLink={this.props.refLink}
                      isTabletLand={isTabletLand}
                      companyAvatarUrl={campaign && campaign.media && campaign.media.avatar && campaign.media.avatar.url ? `${campaign.media.avatar.url}` : ''}
                      bussinessName={campaign && campaign.keyTerms
                        && campaign.keyTerms.shorthandBusinessName}
                    />
                  )
                }
                {campaign && campaign.updates && campaign.updates.length > 1 ? (
                  <Button onClick={() => this.handleCollapseExpand('expandUpdate', '#updates')} className={`${!isTablet ? 'mt-20' : ''} link-button highlight-text`}>
                    {this.state.expandUpdate ? 'Collapse' : 'Expand'} All Updates
                  <Icon className={`ns-caret-${this.state.expandUpdate ? 'up' : 'down'} right`} />
                  </Button>
                ) : null
                }
                <Divider hidden section />
              </>
            )
          }
          <InvestmentDetails newLayout />
          <AboutCompany newLayout />
          {campaignStatus.isBonusReward
            ? (
              <>
                <BonusRewards newLayout />
                <Divider hidden section />
              </>
            ) : null
          }
          {campaignStatus.gallery !== 0 && !campaignStatus.isFund ? (
            <>
              <Gallery
                processScroll={this.processScroll}
                newLayout
                galleryUrl={this.props.match.url}
              />
              <Divider hidden section />
            </>
          ) : null}
          {(dataRoomDocs.length && ['LIVE', 'CREATION'].includes(get(campaign, 'stage')))
            ? (
              <>
                <Documents newLayout />
                <Divider hidden section />
              </>
            ) : null
          }
          <>
            {campaignStatus.isRevenueShare ? (<RevenueSharingSummary newLayout {...this.props} />) : null
            // campaignStatus.isTermNote && (<TotalPaymentCalculator newLayout {...this.props} />)
            }
            <Divider hidden section />
            {!campaignStatus.isFund && <Comments refLink={this.props.match.url} newLayout showOnlyOne={!this.state.expandComments} />}
            {postedCommentCount > 1
            && (
              <Button onClick={() => this.handleCollapseExpand('expandComments', '#comments')} className="link-button highlight-text mt-40">
                {this.state.expandComments ? 'Collapse' : 'Expand'} All Comments
                <Icon className={`ns-caret-${this.state.expandComments ? 'up' : 'down'} right`} />
              </Button>
              )
            }
          </>
        </>
        )}
        {campaignStatus.issuerStatement ? (
          <>
            <Divider hidden section />
            <IssuerStatement newLayout issuerStatement={campaignStatus.issuerStatement} />
          </>
        ) : null
        }
        <Route path={`${this.props.match.url}/herovideo`} render={props => <VideoModal newLayout refLink={props.match} {...props} />} />
        <Route path={`${this.props.match.url}/photogallery`} component={AboutPhotoGallery} />
      </div>
    );
  }
}

export default CampaignLayout;
