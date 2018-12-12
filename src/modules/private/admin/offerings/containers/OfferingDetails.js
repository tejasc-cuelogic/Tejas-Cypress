import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, Link } from 'react-router-dom';
import { find } from 'lodash';
import Aux from 'react-aux';
import { Modal, Card, Header, Icon } from 'semantic-ui-react';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { InlineLoader } from '../../../../../theme/shared';
import LiveSummary from '../components/LiveSummary';
import CreationSummary from '../components/CreationSummary';
import OfferingModule from '../../../shared/offerings/components';
import EditOffering from '../components/EditOfferingModal';
import EditPoc from '../components/EditPocModal';

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
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.offeringCreationStore.resetOfferingId();
    this.props.history.push(`${this.props.refLink}/${this.props.match.params.stage}`);
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
    navItems = navStore.filterByAccess(
      navItems,
      find(offeringsStore.phases, (s, i) => i === offer.stage).accessKey,
    );
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
                <Link target="_blank" to={`/offerings/preview/${offer.id}/overview`}>
                  <Icon className="ns-view" /><b>Preview the offering page</b>
                </Link>
                {offer.stage === 'CREATION' &&
                <small className="pull-right"><Link to={`${match.url}/editPoc`}><Icon className="ns-pencil" />Edit</Link></small>
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
        <Route path={`${match.url}/editPoc`} render={props => <EditPoc refLink={match.url} {...props} />} />
        <Route path={`${match.url}/editOffering`} render={props => <EditOffering refLink={match.url} {...props} />} />
      </Aux>
    );
  }
}
