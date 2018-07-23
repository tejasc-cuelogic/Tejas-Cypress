import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Loadable from 'react-loadable';
import { Button } from 'semantic-ui-react';
import { includes } from 'lodash';
import PrivateLayout from '../../../shared/PrivateHOC';
import Helper from '../../../../../helper/utility';
import { GetNavMeta } from '../../../../../theme/layout/SidebarNav';
import { Logo } from '../../../../../theme/shared';
import Failure from '../components/Failure';
import Success from '../components/Success';
import Application from '../components/lendio/Application';
import ConfirmModal from '../components/confirmModal';

const getModule = component => Loadable({
  loader: () => import(`../components/${component}`),
  loading() {
    return <div>Loading...</div>;
  },
});

@inject('businessAppStore', 'uiStore', 'navStore')
@observer
export default class BusinessApplication extends Component {
  componentWillMount() {
    const { params } = this.props.match;
    const {
      isFetchedData, fetchApplicationDataById, setFieldvalue, formReset,
      calculateStepToRender,
    } = this.props.businessAppStore;
    setFieldvalue('currentApplicationId', params.applicationId);
    if (params.applicationId !== 'new' && isFetchedData !== params.applicationId) {
      setFieldvalue('isFetchedData', params.applicationId);
      fetchApplicationDataById(params.applicationId).then(() => {
        console.log(`${this.props.match.url}/${calculateStepToRender}`);
        // this.props.history.replace(`${this.props.match.url}/${calculateStepToRender}`);
      });
    } else if (params.applicationId === 'new') {
      this.props.navStore.setAccessParams('appStatus', 'NEW');
      formReset();
    }
  }

  saveContinue = () => {
    this.props.history.push(`${this.props.match.url}/confirm`);
  }

  submitSaveContinue = (e) => {
    e.preventDefault();
    this.props.businessAppStore.businessAppParitalSubmit().then(() => {
      Helper.toast('Business application saved!', 'success');
      this.props.history.push('/app/dashboard');
    });
  }

  submit = () => {
    this.props.businessAppStore.businessApplicationSubmitAction().then(() => {
      Helper.toast('Business application submitted successfully!', 'success');
      this.props.history.push('/app/dashboard');
    });
  }

  render() {
    const { match } = this.props;
    const { pathname } = this.props.location;
    const { canSubmitApp, appStepsStatus, isFileUploading } = this.props.businessAppStore;
    const showSubNav = (includes(pathname, 'pre-qualification') && appStepsStatus[0] === 'IN_PROGRESS')
      || includes(pathname, 'failed') || includes(pathname, 'success') || includes(pathname, 'lendio');
    const preQualPage = includes(pathname, 'pre-qualification');
    const navItems = GetNavMeta(match.url).subNavigations;
    return (
      <PrivateLayout
        subNav={!showSubNav}
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
        P4={!showSubNav && !preQualPage &&
          <Button.Group>
            <Button inverted onClick={this.saveContinue} disabled={isFileUploading} color="green">{isFileUploading ? 'File operation in process' : 'Save and Continue later'}</Button>
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
          <Route exact path={`/app/business-application/${this.props.match.params.applicationId}/failed/:reason?`} component={Failure} />
          <Route exact path={`/app/business-application/${this.props.match.params.applicationId}/lendio`} component={Application} />
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
