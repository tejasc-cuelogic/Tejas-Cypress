import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, Link } from 'react-router-dom';
import { get } from 'lodash';
import { Menu, Icon } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import PrivateLayout from '../../shared/PrivateLayout';
import OfferingModule from '../../shared/offerings/components';
import { DataFormatter } from '../../../../helper';
import Helper from '../../../../helper/utility';
import { InlineLoader } from '../../../../theme/shared';

@inject('uiStore', 'navStore', 'offeringsStore', 'offeringCreationStore', 'userStore')
@observer
export default class Offering extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/${this.props.navStore.navMeta.subNavigations[0].to}`);
    }
    if (!(this.props.offeringsStore.initLoad.includes('getOne') && this.props.offeringsStore.currentId === this.props.match.params.id)) {
      this.props.offeringsStore.getOne(this.props.match.params.id);
    }
    this.props.navStore.setAccessParams('specificNav', '/app/offering/2/overview');
    this.props.offeringCreationStore.setCurrentOfferingId(this.props.match.params.id);
  }

  module = name => DataFormatter.upperCamelCase(name);

  render() {
    const { match, offeringsStore } = this.props;
    const { offer, offerLoading } = offeringsStore;
    if (offerLoading || (offer && !offer.stage)) {
      return <InlineLoader />;
    }
    const navItems = this.props.navStore.navMeta.subNavigations;
    return (
      <>
        <Helmet>
          <title>{Helper.pageTitle(`${get(offer, 'keyTerms.shorthandBusinessName' || 'Alternative Investments Made Simple')} - NextSeed`)}</title>
        </Helmet>
        <PrivateLayout
          {...this.props}
          offeringSlug={offer.offeringSlug}
          rightLabel={<Menu.Item position="right"><Link target="_blank" to={`/offerings/preview/${offer.offeringSlug}`}><Icon className="ns-view" /><b>View Offering</b></Link></Menu.Item>}
        >
          <Switch>
            <Route exact path={match.url} component={OfferingModule('overview')} />
            {
              navItems.map((item) => {
                const { id } = this.props.match.params;
                const CurrentModule = OfferingModule(item.to);
                return (
                  <Route
                    key={item.to}
                    path={`${match.url}/${item.to}`}
                    render={props => <CurrentModule {...props} offeringId={id} />}
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
