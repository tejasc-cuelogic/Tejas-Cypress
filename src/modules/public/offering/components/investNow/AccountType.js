import React, { Component } from 'react';
import Aux from 'react-aux';
import { includes } from 'lodash';
import { Header, Form, Icon, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import cookie from 'react-cookies';
import { FormRadioGroup, FormCheckbox } from '../../../../../theme/form';
import { OFFERING_ACCRDITATION_STATUS_MESSAGE } from '../../../../../constants/offering';
import { Spinner } from '../../../../../theme/shared';

@inject('investmentStore', 'userDetailsStore', 'investmentLimitStore', 'userStore', 'campaignStore', 'accreditationStore')
@withRouter
@observer
class AccountType extends Component {
  componentWillMount() {
    const {
      byDefaultRender,
      setStepToBeRendered,
    } = this.props.investmentStore;
    const { activeAccounts, frozenAccounts } = this.props.userDetailsStore.signupStatus;
    const {
      setPartialInvestmenSession,
      sendAdminEmailOfFrozenAccount,
    } = this.props.userDetailsStore;
    const { campaign } = this.props.campaignStore;
    const offeringReuglation = campaign && campaign.regulation;
    const isRegulationCheck = !!(offeringReuglation && (offeringReuglation === 'BD_506C' || offeringReuglation === 'BD_CF_506C'));
    const regulationType = offeringReuglation;
    const {
      userAccredetiationState,
      resetAccreditationExpirayForm,
    } = this.props.accreditationStore;
    resetAccreditationExpirayForm('ACCREDITATION_EXPIRY_FORM');
    if (!byDefaultRender) {
      setStepToBeRendered(2);
    } else if (this.props.changeInvest || (activeAccounts && activeAccounts.length === 1)) {
      if ((isRegulationCheck && userAccredetiationState && userAccredetiationState === 'ELGIBLE') || (isRegulationCheck && regulationType && regulationType === 'BD_CF_506C' && userAccredetiationState && userAccredetiationState === 'PENDING') || !isRegulationCheck) {
        const accountType = this.props.changeInvest ? includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity' : activeAccounts[0];
        this.props.investmentStore.accTypeChanged(null, { value: accountType }).then(() => {
          if (this.props.investmentStore.getSelectedAccountTypeId) {
            setStepToBeRendered(1);
          }
        });
      }
    }
    setPartialInvestmenSession();
    if (frozenAccounts.length) {
      if (!cookie.load('ADMIN_FROZEN_EMAIL') && cookie.load('ADMIN_FROZEN_EMAIL') === undefined) {
        // send email to admin
        sendAdminEmailOfFrozenAccount('INVESTMENT');
      }
    }
    this.props.accreditationStore.getUserAccreditation().then(() => {
      this.props.accreditationStore.initiateAccreditation();
      if (isRegulationCheck) {
        this.props.accreditationStore.accreditatedAccounts();
        this.props.accreditationStore.userAccreditatedStatus();
        this.props.accreditationStore.validInvestmentAccounts();
      }
    });
  }
  componentDidMount() {
    const {
      setStepToBeRendered,
      setFieldValue,
      investAccTypes,
      byDefaultRender,
    } = this.props.investmentStore;
    const { activeAccounts } = this.props.userDetailsStore.signupStatus;
    const { campaign } = this.props.campaignStore;
    const offeringReuglation = campaign && campaign.regulation;
    const isRegulationCheck = !!(offeringReuglation && (offeringReuglation === 'BD_506C' || offeringReuglation === 'BD_CF_506C'));
    const regulationType = offeringReuglation;
    const { userAccredetiationState } = this.props.accreditationStore;
    if (this.props.investmentStore.getSelectedAccountTypeId) {
      this.props.investmentLimitStore
        .getInvestorInvestmentLimit(this.props.investmentStore.getSelectedAccountTypeId);
    }
    if (!byDefaultRender) {
      setStepToBeRendered(2);
    } else if ((activeAccounts && activeAccounts.length === 1) || (isRegulationCheck && investAccTypes.values.length && userAccredetiationState === 'ELGIBLE') || (isRegulationCheck && investAccTypes.values.length && regulationType && regulationType === 'BD_CF_506C' && userAccredetiationState === 'PENDING')) {
      if ((isRegulationCheck && userAccredetiationState && userAccredetiationState === 'ELGIBLE') || (isRegulationCheck && regulationType && regulationType === 'BD_CF_506C' && userAccredetiationState && userAccredetiationState === 'PENDING') || !isRegulationCheck) {
        setFieldValue('disableNextbtn', false);
        setStepToBeRendered(1);
      }
    }
  }
  radioChnaged = (e, res) => {
    this.setState({ investAccountType: { ...this.state.investAccountType, value: res.value } });
  }
  handlUpdateExpiration = (e) => {
    e.preventDefault();
    const { updateAccreditationExpiray } = this.props.accreditationStore;
    updateAccreditationExpiray();
    this.props.history.push(this.props.refLink);
  }
  render() {
    const {
      activeAccounts,
      frozenAccounts,
      partialAccounts,
    } = this.props.userDetailsStore.signupStatus;
    const {
      accTypeChanged,
      investAccTypes,
      prepareAccountTypes,
    } = this.props.investmentStore;
    prepareAccountTypes(activeAccounts);
    const { campaign } = this.props.campaignStore;
    const offeringReuglation = campaign && campaign.regulation;
    const isRegulationCheck = !!(offeringReuglation && (offeringReuglation === 'BD_506C' || offeringReuglation === 'BD_CF_506C'));
    const regulationType = offeringReuglation;
    const { userDetails, setPartialInvestmenSession } = this.props.userDetailsStore;
    const userProfileFullStatus = userDetails && userDetails.status && userDetails.status === 'FULL' ? userDetails.status : 'PARTIAL';
    const offeringInvestnowURL = this.props.match.url;
    const { currentUser } = this.props.userStore;
    const redirectURL = !isRegulationCheck ? currentUser && currentUser.roles && currentUser.roles.includes('investor') ?
      `${this.props.userDetailsStore.pendingStep}` : '/app/summary' : '/app/profile-settings/investment-limits';
    let headerToShow = (activeAccounts.length || investAccTypes.values.length) ? 'Which Investment Account would you like to invest from?' : frozenAccounts.length ? 'Your investment account is frozen for investments.' : 'You do not have a full investment account.';
    let subHeaderToShow = 'Choose an account type';
    const isParitalSectionNeedtoShow = !(partialAccounts.length && frozenAccounts.length);
    const {
      accreditationData,
      userAccredetiationState,
      ACCREDITATION_EXPIRY_FORM,
      expirationChange,
    } = this.props.accreditationStore;
    if (userProfileFullStatus !== 'FULL' || (userAccredetiationState && (userAccredetiationState === 'NOT_ELGIBLE' || userAccredetiationState === 'INACTIVE'))) {
      setPartialInvestmenSession(offeringInvestnowURL);
    } else {
      setPartialInvestmenSession();
    }
    if (isRegulationCheck && (!accreditationData.ira || !userAccredetiationState)) {
      return <Spinner loaderMessage="Loading.." />;
    }
    if ((activeAccounts.length || investAccTypes.values.length) && isRegulationCheck) {
      headerToShow = userAccredetiationState ?
        OFFERING_ACCRDITATION_STATUS_MESSAGE[userAccredetiationState].header : headerToShow;
      subHeaderToShow = userAccredetiationState ?
        OFFERING_ACCRDITATION_STATUS_MESSAGE[userAccredetiationState].subHeader : subHeaderToShow;
    }
    return (
      <Aux>
        <Header as="h3" textAlign="center"> {headerToShow}</Header>
        <Form error className="account-type-tab">
          {investAccTypes.values.length ?
            <Aux>
              <p className="center-align">{subHeaderToShow}</p>
              {userAccredetiationState === undefined || userAccredetiationState === 'ELGIBLE' || (regulationType && regulationType === 'BD_CF_506C' && userAccredetiationState === 'PENDING') || !isRegulationCheck ?
                <FormRadioGroup
                  name="investAccountType"
                  containerclassname="button-radio center-align"
                  fielddata={investAccTypes}
                  changed={accTypeChanged}
                />
                :
                <Aux>
                  <div className="center-align">
                    {userAccredetiationState === 'NOT_ELGIBLE' || userAccredetiationState === 'INACTIVE' ?
                      <Link to={redirectURL} className="text-link">
                        <Icon className="ns-arrow-right" color="green" />
                        Apply for accrditation
                      </Link>
                      :
                      userAccredetiationState === 'EXPIRED' ?
                        <Aux>
                          <Form error>
                            <FormCheckbox
                              fielddata={ACCREDITATION_EXPIRY_FORM.fields.financialStatus}
                              name="financialStatus"
                              changed={expirationChange}
                              defaults
                              containerclassname="ui relaxed list"
                            />
                            <Button as={Link} to="/" onClick={e => this.handlUpdateExpiration(e)} primary className="relaxed" content="Update accrditation" disabled={!(ACCREDITATION_EXPIRY_FORM.meta.isValid)} />
                          </Form>
                          {/* <Link
                            to="/"
                            className="text-link"
                            onClick={e => this.handlUpdateExpiration(e)}
                            disabled={!(ACCREDITATION_EXPIRY_FORM.meta.isValid)}
                          >
                            <Icon className="ns-arrow-right" color="green" />
                            Update accrditation
                          </Link> */}
                        </Aux>
                        :
                        null
                    }
                  </div>
                </Aux>
              }
            </Aux>
            :
            <div className="center-align">
              {frozenAccounts && frozenAccounts.length ?
                <p>Please contact <a href="mailto:support@nextseed.com">support@nextseed.com</a>. to unlock your account.</p>
                :
                null}
              {(partialAccounts && partialAccounts.length && isParitalSectionNeedtoShow) || (!(frozenAccounts.length) && userProfileFullStatus !== 'FULL' && isParitalSectionNeedtoShow) ?
                <Link to={redirectURL} className="text-link">
                  <Icon className="ns-arrow-right" color="green" />
                  Please finish your account setup.
                </Link>
                :
                null}
            </div>
          }
        </Form>
      </Aux>
    );
  }
}
export default AccountType;
