import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Loadable from 'react-loadable';
import { Button } from 'semantic-ui-react';
import PrivateLayout from '../../../shared/PrivateHOC';
import Helper from '../../../../../helper/utility';
import { GetNavMeta } from '../../../../../theme/layout/SidebarNav';
import { Logo } from '../../../../../theme/shared';
import Failure from '../components/Failure';
import Success from '../components/Success';
import ConfirmModal from '../components/confirmModal';

const getModule = component => Loadable({
  loader: () => import(`../components/${component}`),
  loading() {
    return <div>Loading...</div>;
  },
});

@inject('newBusinessStore', 'uiStore', 'navStore')
@observer
export default class BusinessApplication extends Component {
  componentWillMount() {
    this.props.newBusinessStore.setCurrentApplicationId(this.props.match.params.applicationId);
    if (this.props.match.params.applicationId !== 'new' &&
    this.props.newBusinessStore.isFetchedData !== this.props.match.params.applicationId) {
      this.props.newBusinessStore.fetchApplicationDataById(this.props.match.params.applicationId);
      this.props.newBusinessStore.setFetchedData(this.props.match.params.applicationId);
      // this.props.history.replace(`${this.props.match.url}/pre-qualification`);
    } else if (this.props.match.params.applicationId === 'new') {
      this.props.navStore.setAccessParams('appStatus', 'NEW');
      this.props.newBusinessStore.formReset();
    }
  }

  saveContinue = () => {
    this.props.history.push(`${this.props.match.url}/confirm`);
  }

  submitSaveContinue = (e) => {
    e.preventDefault();
    const stepUrl = this.props.location.pathname.split('/');
    this.props.newBusinessStore.businessAppParitalSubmit(stepUrl[4]).then(() => {
      Helper.toast('Business application saved!', 'success');
      this.props.history.push('/app/dashboard');
    });
  }

  submit = () => {
    this.props.newBusinessStore.businessApplicationSubmitAction().then(() => {
      Helper.toast('Business application submitted successfully!', 'success');
      this.props.history.push('/app/dashboard');
    });
  }

  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url).subNavigations;
    const { canSubmitApp } = this.props.newBusinessStore;
    return (
      <PrivateLayout
        {...this.props}
        P0={
          <Logo
            className="logo"
            verticalAlign="middle"
            dataSrc="LogoWhite"
            as={Link}
            to="/app/dashboard"
            size="small"
          />
        }
        P4={
          <Button.Group>
            <Button inverted onClick={this.saveContinue} color="green">Save and Continue later</Button>
            <Button
              onClick={this.submit}
              className={canSubmitApp ? 'primary' : 'grey'}
              disabled={!canSubmitApp}
            >
              Submit
            </Button>
          </Button.Group>
        }
      >
        <Switch>
          <Route exact path={match.url} component={getModule(navItems[0].component)} />
          <Route exact path={`/app/business-application/${this.props.match.params.applicationId}/failed`} component={Failure} />
          <Route exact path={`/app/business-application/${this.props.match.params.applicationId}/success`} render={props1 => <Success refLink={this.props.match.url} applicationId={this.props.match.params.applicationId} {...props1} />} />
          {
            navItems.map(item => (
              <Route exact key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
            ))
          }
        </Switch>
        <Route exact path={`${this.props.match.url}/confirm`} render={() => <ConfirmModal partialSave={this.submitSaveContinue} stepLink={this.props.location.pathname} refLink={this.props.match.url} />} />
      </PrivateLayout>
    );
  }
}
