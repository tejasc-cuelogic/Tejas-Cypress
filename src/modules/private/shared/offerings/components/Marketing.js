import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { lazyRetry } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

const getModule = component => lazyRetry(() => import(`./marketing/${component}`));

@inject('userStore', 'uiStore', 'manageOfferingStore')
@withRouter
@observer
export default class Marketing extends Component {
  constructor(props) {
    super(props);
    const { match, manageOfferingStore, history } = props;
    if (match.isExact) {
      history.push(`${match.url}/tombstone`);
    }
    manageOfferingStore.setFormData('TOMBSTONE_BASIC_FRM', 'tombstone');
    manageOfferingStore.setFormData('SUB_HEADER_BASIC_FRM', 'subHeader');
    manageOfferingStore.setFormData('HEADER_BASIC_FRM', 'header');
    manageOfferingStore.setFormData('OFFERING_MISC_FRM', 'misc');
  }

  render() {
    const { isIssuer } = this.props.userStore;
    const navItems = [
      { title: 'Tombstone', to: 'tombstone', component: 'Tombstone' },
      { title: 'Header', to: 'header', component: 'CampaignHeader' },
      { title: 'Sub Header', to: 'sub-header', component: 'CampaignSubHeader' },
      { title: 'Content', to: 'content', component: 'Content' },
      { title: 'Misc', to: 'misc', component: 'Misc' },
    ];
    const { match } = this.props;
    return (
      <div className={isIssuer ? 'ui card fluid' : ''}>
        <SecondaryMenu force2ary={!isIssuer} match={match} navItems={navItems} />
        <Switch>
          <Route exact path={match.url} component={getModule(navItems[0].component)} />
          {
            navItems.map(item => (
              <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
            ))
          }
        </Switch>
      </div>
    );
  }
}
