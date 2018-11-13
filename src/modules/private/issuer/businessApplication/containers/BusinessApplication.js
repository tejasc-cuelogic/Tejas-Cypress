import React, { Component } from 'react';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Loadable from 'react-loadable';
import { Menu } from 'semantic-ui-react';
import PrivateLayout from '../../../shared/PrivateHOC';
import Helper from '../../../../../helper/utility';
import { GetNavMeta } from '../../../../../theme/layout/SidebarNav';
import { Logo, InlineLoader } from '../../../../../theme/shared';
import Failure from '../../../../shared/businessApplication/components/Failure';
import Success from '../../../../shared/businessApplication/components/Success';
import Application from '../../../../shared/businessApplication/components/lendio/Application';
import ConfirmModal from '../../../../shared/businessApplication/components/confirmModal';
import NeedHelpModal from '../../../../shared/businessApplication/components/NeedHelpModal';
import LendioSuccess from '../../../../shared/businessApplication/components/lendio/LendioSuccess';
import { HeaderButtons } from '../../../../shared/businessApplication/components/HeaderButtons';

const getModule = component => Loadable({
  loader: () => import(`../../../../shared/businessApplication/components//${component}`),
  loading() {
    return <InlineLoader />;
  },
});

@inject('businessAppStore', 'uiStore', 'navStore')
@withRouter
@observer
export default class BusinessApplication extends Component {
  componentWillMount() {
    const { match } = this.props;
    const { pathname } = this.props.location;
    const {
      isFetchedData, fetchApplicationDataById, setFieldvalue, formReset, setPrequalBasicDetails,
    } = this.props.businessAppStore;
    setFieldvalue('currentApplicationId', match.params.applicationId);
    setFieldvalue('currentApplicationType', match.params.applicationType);
    if (match.params.applicationId !== 'new' && isFetchedData !== match.params.applicationId) {
      formReset();
      setFieldvalue('isFetchedData', match.params.applicationId);
      fetchApplicationDataById(match.params.applicationId).then(() => {
        this.props.businessAppStore.setFieldvalue('isPrequalQulify', true);
        if (this.checkIncludes(['pre-qualification', 'business-details', 'performance', 'documentation'], pathname)) {
          this.props.history.replace(`${match.url}/${this.props.businessAppStore.stepToRender.path}`);
        }
      });
    } else if (match.params.applicationId === 'new') {
      this.props.navStore.setAccessParams('appStatus', 'NEW');
      formReset();
      setPrequalBasicDetails();
    }
  }

  getLogoStyle = path => (path.includes('/lendio') ? { height: '28px', width: 'auto' } : {});

  saveContinue = () => this.props.history.push(`${this.props.match.url}/confirm`);

  submitSaveContinue = (e) => {
    e.preventDefault();
    this.props.businessAppStore.businessAppParitalSubmit().then(() => {
      Helper.toast('Business application saved!', 'success');
      this.props.history.push('/app/dashboard');
    });
  }

  // submit = () => {
  //   this.props.businessAppStore.businessApplicationSubmitAction().then(() => {
  //     Helper.toast('Business application submitted successfully!', 'success');
  //     this.props.history.push('/app/dashboard');
  //   });
  // }
  submit = (e) => {
    e.preventDefault();
    const {
      checkFormisValid, currentApplicationId, applicationStep,
      currentApplicationType, businessAppParitalSubmit, businessApplicationSubmitAction,
    } = this.props.businessAppStore;
    if (checkFormisValid(applicationStep, true)) {
      businessAppParitalSubmit().then((result) => {
        if (result && this.props.businessAppStore.canSubmitApp) {
          businessApplicationSubmitAction().then(() => {
            Helper.toast('Business application submitted successfully!', 'success');
            this.props.history.push('/app/dashboard');
          });
        } else {
          this.props.history.push(`/app/business-application/${currentApplicationType}/${currentApplicationId}/${applicationStep}`);
        }
      });
    }
  }

  preQualSubmit = (e) => {
    e.preventDefault();
    this.props.businessAppStore.setPrequalBasicDetails();
    this.props.businessAppStore.businessPreQualificationBasicFormSumbit()
      .then(() => {
        this.props.businessAppStore.setFieldvalue('isPrequalQulify', true);
        this.props.businessAppStore.businessPreQualificationFormSumbit()
          .then(() => {
            const url = this.props.businessAppStore.BUSINESS_APP_STEP_URL;
            Helper.toast('Business pre-qualification request submitted!', 'success');
            this.props.history.push(`/app/business-application/${url}`);
          });
      });
  }

  checkIncludes = (paths, pathname) => paths.some(val => pathname.includes(val));

  calculateShowSubNav = (paths, pathname, appStepsStatus) => (appStepsStatus === 'IN_PROGRESS' && pathname.includes('pre-qualification')) || this.checkIncludes(paths, pathname);

  render() {
    const { inProgress } = this.props.uiStore;
    const { match } = this.props;
    const { pathname } = this.props.location;
    const {
      canSubmitApp, appStepsStatus, isFileUploading,
      BUSINESS_APP_FRM, formReadOnlyMode, ButtonTextToggle,
    } = this.props.businessAppStore;
    const showSubNav = this.calculateShowSubNav(['failed', 'success', 'lendio'], pathname, appStepsStatus[0].status, formReadOnlyMode);
    const preQualPage = pathname.includes('pre-qualification');
    const navItems = GetNavMeta(match.url).subNavigations;
    const logoUrl = this.checkIncludes([`${match.url}/lendio`, `${match.url}/success/lendio`], pathname) ? 'LogoNsAndLendio' : 'LogoWhiteGreen';
    return (
      <PrivateLayout
        subNavComponent={<Menu.Item position="right"><Link to={`${match.url}/need-help`}>Need Help / Have Questions?</Link></Menu.Item>}
        subNav={!showSubNav}
        appStepsStatus={appStepsStatus}
        {...this.props}
        P0={
          <Link to="/app/dashboard">
            <Logo
              size="small"
              alt="NextSeed.com"
              dataSrc={logoUrl}
              style={this.getLogoStyle(this.props.location.pathname)}
              verticalAlign="middle"
            />
          </Link>
        }
        buttonWidth={6}
        P4={
          <HeaderButtons
            disabled={formReadOnlyMode}
            saveContinue={this.saveContinue}
            submitApp={this.submit}
            showSubNav={showSubNav}
            canSubmitApp={canSubmitApp}
            ButtonTextToggle={ButtonTextToggle}
            preQualSubmit={this.preQualSubmit}
            inProgress={inProgress}
            isFileUploading={isFileUploading}
            preQualPage={preQualPage}
            isValid={BUSINESS_APP_FRM.meta.isValid}
          />
        }
      >
        <Switch>
          <Route exact path={match.url} component={getModule(navItems[0].component)} />
          <Route exact path={`${match.url}/failed/:reason?`} component={Failure} />
          <Route exact path={`${match.url}/lendio`} render={props => <Application applicationId={match.params.applicationId} {...props} />} />
          <Route exact path={`${match.url}/lendio/:condition`} component={LendioSuccess} />
          <Route exact path={`${match.url}/success`} render={props => <Success refLink={match.url} applicationId={match.params.applicationId} {...props} />} />
          {
            navItems.map(item => (
              <Route exact key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
            ))
          }
        </Switch>
        <Route exact path={`${match.url}/confirm`} render={() => <ConfirmModal partialSave={this.submitSaveContinue} stepLink={pathname} refLink={match.url} />} />
        <Route exact path={`${match.url}/need-help`} render={() => <NeedHelpModal />} />
      </PrivateLayout>
    );
  }
}
