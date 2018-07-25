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
    const { pathname } = this.props.location;
    const {
      isFetchedData, fetchApplicationDataById, setFieldvalue, formReset,
    } = this.props.businessAppStore;
    setFieldvalue('currentApplicationId', params.applicationId);
    if (params.applicationId !== 'new' && isFetchedData !== params.applicationId) {
      setFieldvalue('isFetchedData', params.applicationId);
      fetchApplicationDataById(params.applicationId).then(() => {
        if (includes(pathname, 'pre-qualification') || includes(pathname, 'business-details') || includes(pathname, 'performance') || includes(pathname, 'documentation')) {
          this.props.history.replace(`${this.props.match.url}/${this.props.businessAppStore.stepToRender}`);
        }
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

  preQualSubmit = (e) => {
    e.preventDefault();
    this.props.businessAppStore.businessPreQualificationFormSumbit().then(() => {
      const url = this.props.businessAppStore.getBusinessAppStepUrl;
      Helper.toast('Business pre-qualification request submitted!', 'success');
      this.props.history.push(`/app/business-application/${url}`);
    });
  }

  render() {
    const { inProgress } = this.props.uiStore;
    const { match } = this.props;
    const { pathname } = this.props.location;
    const {
      canSubmitApp,
      appStepsStatus,
      isFileUploading,
      BUSINESS_APP_FRM,
    } = this.props.businessAppStore;
    const showSubNav = (includes(pathname, 'pre-qualification') && appStepsStatus[0] === 'IN_PROGRESS')
      || includes(pathname, 'failed') || includes(pathname, 'success') || includes(pathname, 'lendio');
    const preQualPage = includes(pathname, 'pre-qualification');
    const navItems = GetNavMeta(match.url).subNavigations;
    const logoUrl = includes(pathname, `${match.url}/lendio`) || includes(pathname, `${match.url}/success/lendio`) ? 'LogoNsAndLendio' : 'LogoWhite';
    return (
      <PrivateLayout
        subNav={!showSubNav}
        {...this.props}
        P0={
          <Logo
            className="logo"
            verticalAlign="middle"
            dataSrc={logoUrl}
            as={Link}
            to="/app/dashboard"
            size={logoUrl === 'LogoWhite' ? 'small' : 'medium'}
          />
        }
        P4={!showSubNav && !preQualPage ?
          <Button.Group>
            <Button inverted onClick={this.saveContinue} disabled={isFileUploading} color="green">{isFileUploading ? 'File operation in process' : 'Save and Continue later'}</Button>
            <Button
              loading={inProgress}
              onClick={this.submit}
              className={canSubmitApp ? 'primary' : 'grey'}
              disabled={!canSubmitApp}
            >
              Submit
            </Button>
          </Button.Group> : preQualPage &&
          <Button.Group>
            <Button as={Link} to="/app/dashboard" inverted onClick={this.saveContinue} color="red">Cancel</Button>
            <Button
              loading={inProgress}
              onClick={this.preQualSubmit}
              className={BUSINESS_APP_FRM.meta.isValid ? 'primary' : 'grey'}
              disabled={!BUSINESS_APP_FRM.meta.isValid}
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
