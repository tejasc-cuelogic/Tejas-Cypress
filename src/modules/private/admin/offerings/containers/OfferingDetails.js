import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, Link } from 'react-router-dom';
import { find, get } from 'lodash';
import Aux from 'react-aux';
import { Modal, Card, Header, Icon } from 'semantic-ui-react';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { InlineLoader } from '../../../../../theme/shared';
import LiveSummary from '../components/LiveSummary';
import CreationSummary from '../components/CreationSummary';
import OfferingModule from '../../../shared/offerings/components';
import EditOffering from '../components/EditOfferingModal';
import EditPoc from '../components/EditPocModal';
import { REACT_APP_DEPLOY_ENV } from '../../../../../constants/common';

@inject('navStore', 'offeringsStore', 'offeringCreationStore')
@observer
export default class OfferingDetails extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/overview`);
    }
    if (!this.props.offeringsStore.initLoad.includes('getOne')) {
      this.props.offeringsStore.getOne(this.props.match.params.offeringid);
    }
    this.props.navStore.setAccessParams('specificNav', '/app/offering/2/overview');
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
    this.props.history.push(`${this.props.refLink}/${this.props.match.params.stage}`);
    window.onpopstate = null;
  };

  render() {
    const { match, offeringsStore, navStore } = this.props;
    let navItems = navStore.specificNavs.subNavigations;
    const { offerLoading, offerOld } = offeringsStore;
    let { offer } = offeringsStore;
    offer = !offerLoading && offerOld.stage ? offerOld : offer;
    if (offerLoading || (offerLoading && offer && !offer.stage)) {
      return <InlineLoader />;
    }
    const isDev = ['localhost', 'develop'].includes(REACT_APP_DEPLOY_ENV);
    navItems = navStore.filterByAccess(
      navItems,
      get(find(offeringsStore.phases, (s, i) => i === offer.stage), 'accessKey'),
    );
    if (this.props.match.params.stage === 'live' && !isDev) {
      navItems = navItems.filter(n => (!['Bonus Rewards', 'Close'].includes(n.title)));
    }
    if (this.props.match.params.stage !== 'creation' && !isDev) {
      navItems = navItems.filter(n => (!['Bonus Rewards'].includes(n.title)));
    }
    if (this.props.match.params.stage === 'engagement' && !isDev) {
      navItems = navItems.filter(n => (n.title !== 'Transactions'));
    }
    return (
      <Aux>
        <Modal closeOnDimmerClick={false} closeOnRootNodeClick={false} closeOnEscape={false} closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
          <Modal.Content className="transaction-details">
            <Header as="h3">
              {((offer.keyTerms && offer.keyTerms.shorthandBusinessName) ?
                offer.keyTerms.shorthandBusinessName : (
                (offer.keyTerms && offer.keyTerms.legalBusinessName) ? offer.keyTerms.legalBusinessName : 'N/A'
              ))}
              <Header.Subheader className="mt-10">
                <Link target="_blank" to={`/offerings/${offer.stage === 'CREATION' ? 'preview/' : ''}${offer.offeringSlug}/overview`}>
                  <Icon className="ns-view" /><b>Preview the offering page</b>
                </Link>
                {offer.stage === 'CREATION' &&
                  <Link to={`${match.url}/editPoc`} className="pull-right"><Icon className="ns-pencil" />Edit</Link>
                }
              </Header.Subheader>
            </Header>
            {offer.stage === 'CREATION' ? <CreationSummary offer={offer} /> : <LiveSummary offer={offer} refLink={this.props.match.url} />}
            <Card fluid>
              <SecondaryMenu match={match} navItems={navItems} />
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
                          render={props => <CurrentModule module={item.title === 'Activity History' ? 'offeringDetails' : false} showFilters={item.title === 'Activity History' ? ['activityType', 'activityUserType'] : false} {...props} resourceId={offeringid} offeringId={offeringid} />}
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
      </Aux>
    );
  }
}
