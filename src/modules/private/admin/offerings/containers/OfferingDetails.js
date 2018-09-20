/* eslint-disable no-unused-vars, arrow-body-style */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route } from 'react-router-dom';
import { Modal, Card, Header } from 'semantic-ui-react';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { DataFormatter } from '../../../../../helper';
import { InlineLoader } from '../../../../../theme/shared';
import Summary from '../components/Summary';
import OfferingModule from '../../../shared/offerings/components';

@inject('navStore', 'offeringsStore')
@observer
export default class OfferingDetails extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/overview`);
    }
    this.props.navStore.setAccessParams('specificNav', '/app/offering/2/overview');
    this.props.offeringsStore.getOne(this.props.match.params.offeringid);
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.refLink);
  };
  summary = (offer) => {
    return {
      summary: [
        {
          title: 'Created date',
          content: offer.created ? DataFormatter.formatedDate(offer.created.date) : 'N/A',
          type: 0,
        },
        { title: 'Lead', content: offer.lead ? offer.lead.name : 'N/A', type: 0 },
        {
          title: 'Days Till Launch',
          content: offer.offering ? `${DataFormatter.diffDays(offer.offering.launch.targetDate)} days` : 'N/A',
          type: 0,
        },
      ],
    };
  };
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { match, offeringsStore, navStore } = this.props;
    let navItems = navStore.specificNavs.subNavigations;
    const { offer, offerLoading } = offeringsStore;

    if (offerLoading || (offer && !offer.keyTerms)) {
      return <InlineLoader />;
    }
    navItems = navStore.filterByAccess(navItems, offeringsStore.allPhases.indexOf(offer.stage) + 1);
    return (
      <Modal closeOnRootNodeClick={false} closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-detials">
          <Header as="h3">{offer.keyTerms.legalBusinessName}</Header>
          <Summary details={this.summary(offer)} />
          <Card fluid>
            <SecondaryMenu match={match} navItems={navItems} />
            <Switch>
              <Route exact path={match.url} component={OfferingModule('overview')} />
              {
                navItems.map(item => (
                  <Route key={item.to} path={`${match.url}/${item.to}`} component={OfferingModule(item.to)} />
                ))
              }
            </Switch>
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}
