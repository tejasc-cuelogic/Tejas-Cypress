import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import { get } from 'lodash';
import { Menu, Icon } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import PrivateLayout from '../../shared/PrivateLayout';
import OfferingModule from '../../shared/offerings/components';
import { DataFormatter } from '../../../../helper';
import Helper from '../../../../helper/utility';
import { InlineLoader } from '../../../../theme/shared';

@inject('uiStore', 'navStore', 'offeringsStore', 'offeringCreationStore', 'userStore', 'campaignStore')
@observer
export default class Offering extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/${get(this.props.navStore, 'navMeta.subNavigations[0].to') || 'overview'}`);
    }
    if (props.offeringCreationStore.currentOfferingSlug !== props.match.params.offeringSlug) {
      if (Helper.isUuid(this.props.match.params.offeringSlug)) {
        this.props.offeringsStore.getofferingById(props.match.params.offeringSlug).then((offeringSlug) => {
          this.props.offeringsStore.getOne(offeringSlug, false);
        });
      } else {
        this.props.offeringsStore.getOne(props.match.params.offeringSlug, !Helper.isUuid(this.props.match.params.offeringSlug));
      }
    }
    this.props.navStore.setAccessParams('specificNav', '/dashboard/offering/2/overview');
  }

  module = name => DataFormatter.upperCamelCase(name);

  render() {
    const { match, offeringsStore } = this.props;
    const { offer, offerLoading } = offeringsStore;
    if (offerLoading || (offer && !offer.stage)) {
      return <InlineLoader />;
    }

    if (Helper.isUuid(this.props.match.params.offeringSlug) && offer.id) {
      return <Redirect from={`/dashboard/offering/${this.props.match.params.offeringSlug}/comments`} to={`/dashboard/offering/${offer.offeringSlug}/comments`} />;
    }

    let navItems = this.props.navStore.navMeta.subNavigations;
    if (offer.stage === 'LIVE') {
      navItems = navItems.filter(n => (n.title !== 'Investors'));
    }
    const template = get(offer, 'template') === 2 ? 2 : 1;
    navItems = navItems.filter(n => (n.template === template || !n.template));
    return (
      <>
        <Helmet>
          <title>{Helper.pageTitle(`${get(offer, 'keyTerms.shorthandBusinessName' || 'Alternative Investments Made Simple')} - NextSeed`)}</title>
        </Helmet>
        <PrivateLayout
          {...this.props}
          offeringSlug={offer.offeringSlug}
          rightLabel={<Menu.Item position="right"><Link target="_blank" to={`/offerings/preview/${offer.offeringSlug}`}><Icon className="ns-view" /><b>Campaign Page</b></Link></Menu.Item>}
        >
          <Switch>
            <Route exact path={match.url} component={OfferingModule('overview')} />
            {
              navItems.map((item) => {
                const CurrentModule = OfferingModule(item.to);
                return (
                  <Route
                    key={item.to}
                    path={`${match.url}/${item.to}`}
                    render={props => <CurrentModule {...props} offeringId={offer.id} />}
                  />
                );
              })
            }
          </Switch>
        </PrivateLayout>
      </>
    );
  }
}
