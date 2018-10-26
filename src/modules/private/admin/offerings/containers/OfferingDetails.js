/* eslint-disable no-unused-vars, arrow-body-style */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, Link } from 'react-router-dom';
import moment from 'moment';
import Aux from 'react-aux';
import { Modal, Card, Header, Icon } from 'semantic-ui-react';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { InlineLoader } from '../../../../../theme/shared';
import LiveSummary from '../components/LiveSummary';
import CreationSummary from '../components/CreationSummary';
import OfferingModule from '../../../shared/offerings/components';
import EditOffering from '../components/EditOfferingModal';

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
    this.props.offeringCreationStore.resetInitLoad();
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.offeringCreationStore.resetOfferingId();
    this.props.history.push(`${this.props.refLink}/${this.props.match.params.stage}`);
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
      <Aux>
        <Modal closeOnDimmerClick={false} closeOnRootNodeClick={false} closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
          <Modal.Content className="transaction-details">
            <Header as="h3">
              {((offer.keyTerms && offer.keyTerms.shorthandBusinessName) ?
                offer.keyTerms.shorthandBusinessName : (
                (offer.keyTerms && offer.keyTerms.legalBusinessName) ? offer.keyTerms.legalBusinessName : 'N/A'
              ))}
              <Header.Subheader className="mt-10">
                <Link target="_blank" to={`/offerings/preview/${offer.id}`}>
                  <Icon className="ns-view" /><b>Preview the offering page</b>
                </Link>
              </Header.Subheader>
            </Header>
            {offer.stage === 'CREATION' ? <CreationSummary offer={offer} /> : <LiveSummary offer={offer} refLink={this.props.match.url} />}
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
        <Route path={`${match.url}/editOffering`} render={props => <EditOffering refLink={match.url} {...props} />} />
      </Aux>
    );
  }
}
