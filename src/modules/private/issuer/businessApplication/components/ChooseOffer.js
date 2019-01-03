import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Modal, Header, Card, Menu, Button, Statistic } from 'semantic-ui-react';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { DataFormatter } from '../../../../../helper';
import { InlineLoader } from '../../../../../theme/shared';
import OffersPanel from '../../../shared/offerings/components/shared/OffersPanel';

const getModule = component => Loadable({
  loader: () => import(`./tabs/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

@inject('businessAppReviewStore', 'uiStore')
@withRouter
@observer
export default class ChooseOffer extends Component {
  componentWillMount() {
    const { match, businessAppReviewStore } = this.props;
    businessAppReviewStore.fetchApplicationOffers(match.params.applicationId).then(() => {
      this.props.businessAppReviewStore.setFormData('OFFERS_FRM', 'offers', 'appReviewStore');
    });
  }
  getBusinessName = res => ((res && res.prequalDetails) ? res.prequalDetails.businessGeneralInfo.businessName : '');
  signPortalAgreement = () => {
    const { match, businessAppReviewStore } = this.props;
    businessAppReviewStore.signPortalAgreement().then(() => {
      this.props.history.push(`/app/dashboard/${match.params.applicationId}/offers/offersSigning`);
    });
  }
  module = name => DataFormatter.upperCamelCase(name);
  handleCloseModal = () => {
    this.props.history.push('/app/dashboard');
  }
  handleSetField = (field, value, location = null) => {
    this.props.businessAppReviewStore.setFieldvalue(field, value);
    if (location) {
      this.props.history.push(`${this.props.match.url}/additional-terms`);
    } else {
      this.props.history.push(`${this.props.match.url}/general-conditions`);
    }
  }
  render() {
    const { match, businessAppReviewStore } = this.props;
    const {
      OFFERS_FRM, formChangeWithIndex, maskChangeWithIndex, selectedOfferIndex,
      offerLoading, fetchBusinessApplicationOffers,
    } = businessAppReviewStore;
    const navItems = [
      { title: 'General Conditions', to: 'general-conditions' },
      { title: 'Summary of Fees', to: 'summary-of-fees' },
      { title: 'Tax Reporting', to: 'tax-reporting' },
      { title: 'Payment Chart', to: 'payment-chart' },
    ];
    if (fetchBusinessApplicationOffers) {
      const offer = fetchBusinessApplicationOffers.offers.offer[selectedOfferIndex];
      if (offer && offer.additionalTerms) {
        navItems.push({ title: 'Additional Terms', to: 'additional-terms' });
      }
    }
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="extra large" closeOnDimmerClick={false}>
        <Modal.Content>
          <Header as="h3" className="text-capitalize">{this.getBusinessName(fetchBusinessApplicationOffers)} Portal Agreement</Header>
          <Statistic size="tiny">
            <Statistic.Value>Congratulations!</Statistic.Value>
            <Statistic.Label>
              We are pleased to inform you that your crowdfunding campaign application is
              approved. Please review the terms below
            </Statistic.Label>
          </Statistic>
          <Header as="h4">Choose from campaign offers</Header>
          <p>Please read more about offer details and choose one to sign in and proceed.</p>
          <p>You have one month from the date of this Approval Letter to accept your Approved
            Terms before they expire. You may accept by circling the preferred Option above and
            signing the Portal Agreement to formalize our partnership and initiate the preparation
            of your crowdfunding campaign.
          </p>
          {offerLoading ?
            <InlineLoader /> :
            <div className="ui form mt-20">
              <OffersPanel
                OFFERS_FRM={OFFERS_FRM}
                formChangeWithIndex={formChangeWithIndex}
                maskChangeWithIndex={maskChangeWithIndex}
                isReadonly
                match={this.props.match}
                selectOffer={this.handleSetField}
                refModule="issuer"
                selectedOfferIndex={selectedOfferIndex}
              />
            </div>
          }
          {selectedOfferIndex !== null && !offerLoading ?
            <Card fluid>
              <SecondaryMenu
                inverted
                match={match}
                navItems={navItems}
                rightLabel={<Menu.Item header position="right">Offer {String.fromCharCode('A'.charCodeAt() + selectedOfferIndex)}</Menu.Item>}
              />
              <div className="inner-content-spacer">
                <Switch>
                  <Route
                    exact
                    path={match.url}
                    component={getModule(this.module(navItems[0].title))}
                  />
                  {
                    navItems.map(item => (
                      <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} component={getModule(this.module(item.title))} />
                    ))
                  }
                </Switch>
              </div>
              <Card.Content extra className="center-align">
                <Button primary loading={this.props.uiStore.inProgress} className="very relaxed" content="Sign portal agreement" onClick={this.signPortalAgreement} />
              </Card.Content>
            </Card> : null
          }
        </Modal.Content>
      </Modal>
    );
  }
}
