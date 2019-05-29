/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { includes } from 'lodash';
import PrivateLayout from '../../../shared/PrivateLayout';
import { InlineLoader } from '../../../../../theme/shared';
import { GetNavMeta } from '../../../../../theme/layout/SidebarNav';
import HtmlEditor from '../../../../shared/HtmlEditor';
import AccountSetup from './AccountSetup';

const getModule = component => Loadable({
  loader: () => import(`./${component}`),
  loading() {
    return <InlineLoader />;
  },
});

const processingMsg = `We are currently processing your account creation request. Please contact
  <a href="mailto:support@nextseed.com">support@nextseed.com</a> if you have any questions.`;

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
    const {
      processingAccounts,
      partialAccounts,
    } = this.props.userDetailsStore.signupStatus;
    const splittedUrl = match.url.split('/');
    const accType = splittedUrl.pop();
    const isAccProcessing = processingAccounts.includes(accType);
    const isAccPartial = partialAccounts.includes(accType);
    const navItems = isAccProcessing ? [] : GetNavMeta(match.url).subNavigations;
    const processing = includes(this.props.location.pathname, 'transactions') ?
      (<div className="content-spacer">
        <section className="center-align">
          <h4 style={{ color: '#31333d7d' }}><HtmlEditor readOnly content={(processingMsg)} /></h4>
        </section>
       </div>) :
      (<section className="center-align">
        <h4 style={{ color: '#31333d7d' }}><HtmlEditor readOnly content={(processingMsg)} /></h4>
      </section>);
    return (
      <PrivateLayout {...this.props}>
        { isAccPartial ? <AccountSetup /> : isAccProcessing ? processing : (
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
