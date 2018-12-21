import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { includes } from 'lodash';
import PrivateLayout from '../../../shared/PrivateLayout';
import { InlineLoader } from '../../../../../theme/shared';
import { GetNavMeta } from '../../../../../theme/layout/SidebarNav';

const getModule = component => Loadable({
  loader: () => import(`./${component}`),
  loading() {
    return <InlineLoader />;
  },
});

const processingMsg = `Please wait, We are processing your request.
  If you have any query please contact support at
  <a href="mailto:support@nextseed.com">support@nextseed.com</a>`;

@inject('userDetailsStore')
@observer
export default class AccountDetails extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/portfolio`);
    }
  }
  render() {
    const { match } = this.props;
    const { processingAccounts } = this.props.userDetailsStore.signupStatus;
    const splittedUrl = match.url.split('/');
    const accType = splittedUrl.pop();
    const isAccProcessing = processingAccounts.includes(accType);
    const navItems = isAccProcessing ? [] : GetNavMeta(match.url).subNavigations;
    const processing = includes(this.props.location.pathname, 'transactions') ?
      <div className="content-spacer"><InlineLoader text={processingMsg} /></div> :
      <InlineLoader text={processingMsg} />;
    return (
      <PrivateLayout {...this.props}>
        {isAccProcessing ? processing : (
          <Switch>
            <Route exact path={match.url} component={getModule(navItems[0].component)} />
            {
              navItems.map(item => (
                <Route key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
              ))
            }
          </Switch>
        )
        }
      </PrivateLayout>
    );
  }
}
