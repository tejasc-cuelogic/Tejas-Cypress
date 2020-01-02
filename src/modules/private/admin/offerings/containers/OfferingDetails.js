import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, Link } from 'react-router-dom';
import { find, get } from 'lodash';
import { Modal, Card, Header, Icon } from 'semantic-ui-react';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { InlineLoader } from '../../../../../theme/shared';
import LiveSummary from '../components/LiveSummary';
import CreationSummary from '../components/CreationSummary';
import OfferingModule from '../../../shared/offerings/components';
import EditOffering from '../components/EditOfferingModal';
import EditPoc from '../components/EditPocModal';
import { REACT_APP_DEPLOY_ENV, NEXTSEED_BOX_URL } from '../../../../../constants/common';
import Helper from '../../../../../helper/utility';


@inject('navStore', 'offeringsStore', 'offeringCreationStore', 'userStore', 'uiStore', 'businessAppStore')
@observer
export default class OfferingDetails extends Component {
  constructor(props) {
    super(props);
    this.props.offeringCreationStore.setFieldValue('isListingPage', false);
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/overview`);
    }
    if (!this.props.offeringsStore.initLoad.includes('getOne')) {
      this.props.offeringsStore.getOne(this.props.match.params.offeringid);
    }
    this.props.navStore.setAccessParams('specificNav', '/dashboard/offering/2/overview');
    this.props.offeringCreationStore.setCurrentOfferingId(this.props.match.params.offeringid);
  }

  componentDidMount() {
    window.onpopstate = this.handleCloseModal;
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.offeringCreationStore.resetAffiliatedIssuerForm();
    this.props.offeringCreationStore.resetAllForms();
    this.props.offeringCreationStore.resetOfferingId();
    this.props.businessAppStore.resetFirstLoad();
    const { stage } = this.props.match.params;
    this.props.offeringsStore.initRequest({ stage }, true);
    this.props.history.push(`${this.props.refLink}/${stage}`);
    window.onpopstate = null;
  };

  openBoxLink = (e, folderId) => {
    e.preventDefault();
    if (folderId) {
      window.open(`${NEXTSEED_BOX_URL}folder/${folderId}`, '_blank');
    } else {
      Helper.toast('Box folder is not created for this user', 'error');
    }
  };

  render() {
    const { match, offeringsStore, navStore } = this.props;
    let navItems = navStore.specificNavs.subNavigations;
    const { offerLoading, offerOld } = offeringsStore;
    let { offer } = offeringsStore;
    const { offerStatus } = offeringsStore;
    offer = !offerLoading && offerOld.stage ? offerOld : offer;
    if (!get(offer, 'id') || (offerLoading && offer && !offer.stage)) {
      return <InlineLoader />;
    }
    const isDev = ['localhost', 'develop', 'dev'].includes(REACT_APP_DEPLOY_ENV);
    navItems = navStore.filterByAccess(
      navItems,
      get(find(offeringsStore.phases, (s, i) => i === offer.stage), 'accessKey'),
    );

    if (this.props.match.params.stage === 'engagement' && !isDev) {
      navItems = navItems.filter(n => (n.title !== 'Transactions'));
    }
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    if (access.level !== 'FULL') {
      navItems = navItems.filter(n => (n.title !== 'Close'));
    }
    // add business application after Bonus Rewards // offer.stage === 'CREATION' &&
    if (offer.applicationId && !['WP_MIGRATION'].includes(offer.applicationId) && offer.issuerId) {
      const pos = navItems.findIndex(n => n.to === 'overview');
      const posSecond = navItems.findIndex(n => n.to === 'offering-creation');
      navItems.splice(
        (pos + 1),
        0,
        { to: 'applications', title: 'App' },
        navItems.splice(posSecond, 1)[0],
      );
    }
    const { responsiveVars } = this.props.uiStore;
    return (
      <>
        <Modal closeOnDimmerClick={false} closeOnRootNodeClick={false} closeOnEscape={false} closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
          <Modal.Content className="transaction-details">
            <Header as="h3">
              {((offer.keyTerms && offer.keyTerms.shorthandBusinessName)
                ? offer.keyTerms.shorthandBusinessName : (
                  (offer.keyTerms && offer.keyTerms.legalBusinessName) ? offer.keyTerms.legalBusinessName : 'N/A'
                ))}
              <Header.Subheader className="mt-10">
                <Link target="_blank" to={`/offerings/${offer.stage === 'CREATION' ? 'preview/' : ''}${offer.offeringSlug}`}>
                  <Icon className="ns-view" /><b>Preview the offering page</b>
                </Link>
                {offer.stage === 'CREATION'
                  && <Link to={`${match.url}/editPoc`} className="pull-right"><Icon className="ns-pencil" />Edit</Link>
                }
              </Header.Subheader>
            </Header>
            {offer.stage === 'CREATION' ? <CreationSummary offer={offer} /> : <LiveSummary offer={offer} refLink={this.props.match.url} onClick={e => this.openBoxLink(e, offer.rootFolderId)} offerStatus={offerStatus} />}
            <Card fluid>
              <SecondaryMenu isBonusReward bonusRewards className="offer-details" offering match={match} navItems={navItems} responsiveVars={responsiveVars} />
              <Switch>
                <Route exact path={match.url} component={OfferingModule('overview')} />
                {
                  navItems.map((item) => {
                    const { offeringid } = this.props.match.params;
                    const CurrentModule = OfferingModule(item.to);
                    return (
                      <Route
                        key={item.to}
                        path={`${match.url}/${item.to}`}
                        render={props => <CurrentModule classes={item.title === 'Activity History' ? 'offering-activity' : ''} module={item.title === 'Activity History' ? 'offeringDetails' : false} showFilters={item.title === 'Activity History' ? ['activityType', 'activityUserType'] : false} {...props} stepName="OFFERING_ACTIVITY_HISTORY" resourceId={offeringid} offeringId={offeringid} issuerId={offer.issuerId} applicationId={offer.applicationId} />}
                      />
                    );
                  })
                }
              </Switch>
            </Card>
          </Modal.Content>
        </Modal>
        <Route path={`${match.url}/editPoc`} render={props => <EditPoc stage={offer.stage} refLink={match.url} {...props} />} />
        <Route path={`${match.url}/editOffering`} render={props => <EditOffering refLink={match.url} {...props} />} />
      </>
    );
  }
}
