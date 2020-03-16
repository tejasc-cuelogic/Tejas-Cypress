import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import { find, get } from 'lodash';
import { Modal, Card, Header, Icon } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { InlineLoader } from '../../../../../theme/shared';
import LiveSummary from '../components/LiveSummary';
import CreationSummary from '../components/CreationSummary';
import OfferingModule from '../../../shared/offerings/components';
import EditOffering from '../components/EditOfferingModal';
import EditPoc from '../components/EditPocModal';
import { REACT_APP_DEPLOY_ENV, NEXTSEED_BOX_URL } from '../../../../../constants/common';
import Helper from '../../../../../helper/utility';
import { STAGES } from '../../../../../services/constants/admin/offerings';


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
      if (Helper.isUuid(this.props.match.params.offeringSlug)) {
        this.props.offeringsStore.getofferingById(props.match.params.offeringSlug).then((offeringSlug) => {
          this.props.offeringsStore.getOne(offeringSlug);
        });
      } else {
        this.props.offeringsStore.getOne(props.match.params.offeringSlug);
      }
    } else {
      const { offer } = this.props.offeringsStore;
      this.props.offeringCreationStore.setCurrentOfferingId(get(offer, 'id'));
      this.props.offeringCreationStore.setFieldValue('currentOfferingSlug', get(offer, 'offeringSlug'));
    }
    this.props.navStore.setAccessParams('specificNav', '/dashboard/offering/2/overview');
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
    const { offer } = this.props.offeringsStore;
    this.props.history.push(`/dashboard/offerings/${STAGES[offer.stage].ref}`);
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
    const { match, offeringsStore, navStore, offeringCreationStore } = this.props;
    let navItems = navStore.specificNavs.subNavigations;
    const { offerLoading, offerOld } = offeringsStore;
    let { offer } = offeringsStore;
    const { currentOfferingId } = offeringCreationStore;
    const { offerStatus } = offeringsStore;
    offer = !offerLoading && offerOld.stage ? offerOld : offer;
    if (!get(offer, 'id') || (offerLoading && offer && !offer.stage)) {
      return <InlineLoader />;
    }
    const template = get(offer, 'template') === 2 ? 2 : 1;
    const isDev = ['localhost', 'dev'].includes(REACT_APP_DEPLOY_ENV);
    navItems = navStore.filterByAccess(
      navItems,
      get(find(offeringsStore.phases, (s, i) => i === offer.stage), 'accessKey'),
    );

    if (Helper.isUuid(this.props.match.params.offeringSlug) && offer.id) {
      return <Redirect from={`/dashboard/offering/${this.props.match.params.offeringSlug}/comments`} to={`/dashboard/offering/${offer.offeringSlug}/comments`} />;
    }

    if (this.props.match.params.stage === 'engagement' && !isDev) {
      navItems = navItems.filter(n => (n.title !== 'Transactions'));
    }
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    if (access.level !== 'FULL') {
      navItems = navItems.filter(n => (n.title !== 'Close'));
    }
    navItems = navItems.filter(n => (n.template === template || !n.template));
    // add business application after Bonus Rewards // offer.stage === 'CREATION' &&
    if (offer.applicationId && !['WP_MIGRATION'].includes(offer.applicationId)) {
      const pos = navItems.findIndex(n => n.to === 'overview');
      navItems.splice(
        (pos + 1),
        0,
        { to: 'applications', title: 'App' },
      );
    }
    const offeringState = !['CREATION'].includes(offer.stage) ? 'OTHER' : offer.stage;
    navItems = navStore.manageNavigationOrder(navItems, offeringState);
    const { responsiveVars } = this.props.uiStore;
    return (
      <>
        <Modal closeOnDimmerClick={false} closeOnRootNodeClick={false} closeOnEscape={false} closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
          <Modal.Content className="transaction-details">
            <CopyToClipboard
              text={currentOfferingId}
              onCopy={() => console.log('copied')}
            >
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
            </CopyToClipboard>
            {offer.stage === 'CREATION' ? <CreationSummary offer={offer} /> : <LiveSummary offer={offer} refLink={this.props.match.url} onClick={e => this.openBoxLink(e, offer.rootFolderId)} offerStatus={offerStatus} />}
            <Card fluid>
              <SecondaryMenu isBonusReward bonusRewards className="offer-details" offering match={match} navItems={navItems} responsiveVars={responsiveVars} />
              <Switch>
                <Route exact path={match.url} component={OfferingModule('overview', template)} />
                {
                  navItems.map((item) => {
                    const CurrentModule = OfferingModule(item.to, template);
                    return (
                      <Route
                        key={item.to}
                        path={`${match.url}/${item.to}`}
                        render={props => <CurrentModule classes={item.title === 'Activity History' ? 'offering-activity' : ''} module={item.title === 'Activity History' ? 'offeringDetails' : false} showFilters={item.title === 'Activity History' ? ['activityType', 'activityUserType'] : false} {...props} stepName="OFFERING_ACTIVITY_HISTORY" resourceId={currentOfferingId} offeringId={currentOfferingId} issuerId={offer.issuerId} applicationId={offer.applicationId} />}
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
