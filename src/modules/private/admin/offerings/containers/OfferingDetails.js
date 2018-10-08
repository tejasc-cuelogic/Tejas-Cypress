/* eslint-disable no-unused-vars, arrow-body-style */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route } from 'react-router-dom';
import { Modal, Card, Header } from 'semantic-ui-react';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { InlineLoader } from '../../../../../theme/shared';
import LiveSummary from '../components/LiveSummary';
import CreationSummary from '../components/CreationSummary';
import OfferingModule from '../../../shared/offerings/components';

@inject('navStore', 'offeringsStore', 'offeringCreationStore')
@observer
export default class OfferingDetails extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/overview`);
    }
    this.props.navStore.setAccessParams('specificNav', '/app/offering/2/overview');
    this.props.offeringsStore.getOne(this.props.match.params.offeringid);
    this.props.offeringCreationStore.setCurrentOfferingId(this.props.match.params.offeringid);
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.offeringCreationStore.resetOfferingId();
    this.props.history.push(this.props.refLink);
  };
  render() {
    const { match, offeringsStore, navStore } = this.props;
    let navItems = navStore.specificNavs.subNavigations;
    const { offer, offerLoading } = offeringsStore;

    if (offerLoading || (offer && !offer.stage)) {
      return <InlineLoader />;
    }
    navItems = navStore.filterByAccess(navItems, offeringsStore.allPhases.indexOf(offer.stage) + 1);
    return (
      <Modal closeOnDimmerClick={false} closeOnRootNodeClick={false} closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-details">
          <Header as="h3">{offer.businessGeneralInfo ? offer.businessGeneralInfo.businessName : offer.keyTerms.legalBusinessName}</Header>
          {offer.stage === 'CREATION' ? <CreationSummary offer={offer} /> : <LiveSummary offer={offer} />}
          <Card fluid>
            <SecondaryMenu match={match} navItems={navItems} />
            <Switch>
              <Route exact path={match.url} component={OfferingModule('overview')} />
              {
                navItems.map((item) => {
                  const CurrentModule = OfferingModule(item.to);
                  return (
                    <Route key={item.to} path={`${match.url}/${item.to}`} render={props => <CurrentModule {...props} offeringId={this.props.match.params.offeringid} />} />
                  );
                })
              }
            </Switch>
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}
