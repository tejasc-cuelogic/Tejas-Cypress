import React, { Component } from 'react';
import Aux from 'react-aux';
import { includes } from 'lodash';
import { Header, Form, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import cookie from 'react-cookies';
import { FormRadioGroup } from '../../../../../theme/form';
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
      sendAdminNotificationEmail,
    } = this.props.userDetailsStore;
    const { campaign } = this.props.campaignStore;
    const offeringReuglation = campaign && campaign.regulation;
    const isRegulationCheck = !!(offeringReuglation && offeringReuglation === 'BD_506C');
    const { userAccredetiationState } = this.props.accreditationStore;
    if (!byDefaultRender) {
      setStepToBeRendered(2);
    } else if (this.props.changeInvest || (activeAccounts && activeAccounts.length === 1)) {
      if ((isRegulationCheck && userAccredetiationState && userAccredetiationState === 'ELGIBLE') || !isRegulationCheck) {
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
      const offeringId = campaign && campaign.id;
      if (!cookie.load('ADMIN_FROZEN_EMAIL') && cookie.load('ADMIN_FROZEN_EMAIL') === undefined) {
        const offeringDetailObj = { offeringId, isEmailSent: true };
        cookie.save('ADMIN_FROZEN_EMAIL', offeringDetailObj, { maxAge: 3600 });
        // send email to admin
        sendAdminNotificationEmail('FROZEN');
        console.log('Send email function call....');
      }
    }
    this.props.accreditationStore.getUserAccreditation().then(() => {
      this.props.accreditationStore.initiateAccreditation();
      if (isRegulationCheck) {
        this.props.accreditationStore.accreditatedAccounts();
        this.props.accreditationStore.validInvestmentAccounts();
        this.props.accreditationStore.userAccreditatedStatus();
      }
    });
  }
  componentDidMount() {
    const {
      setStepToBeRendered,
      setFieldValue,
      byDefaultRender,
    } = this.props.investmentStore;
    const { activeAccounts } = this.props.userDetailsStore.signupStatus;
    const { campaign } = this.props.campaignStore;
    const offeringReuglation = campaign && campaign.regulation;
    const isRegulationCheck = !!(offeringReuglation && offeringReuglation === 'BD_506C');
    const { userAccredetiationState } = this.props.accreditationStore;
    if (this.props.investmentStore.getSelectedAccountTypeId) {
      this.props.investmentLimitStore
        .getInvestorInvestmentLimit(this.props.investmentStore.getSelectedAccountTypeId);
    }
    if (!byDefaultRender) {
      setStepToBeRendered(2);
    } else if (activeAccounts && activeAccounts.length === 1) {
      if ((isRegulationCheck && userAccredetiationState && userAccredetiationState === 'ELGIBLE') || !isRegulationCheck) {
        setFieldValue('disableNextbtn', false);
        setStepToBeRendered(1);
      }
    }
  }
  radioChnaged = (e, res) => {
    this.setState({ investAccountType: { ...this.state.investAccountType, value: res.value } });
  }
  handleVerifyAccreditation = (e, accountType, accountId) => {
    e.preventDefault();
    if (accountType === 'entity') {
      if (this.props.userDetailsStore.isEntityTrust) {
        this.props.history.push(`${this.props.match.url}/verify-trust-entity-accreditation/${accountId}/${accountType}`);
      } else {
        this.props.history.push(`${this.props.match.url}/verify-entity-accreditation/${accountId}/${accountType}`);
      }
    } else {
      this.props.history.push(`${this.props.match.url}/verify-accreditation/${accountId}/${accountType}`);
    }
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
    const isRegulationCheck = !!(offeringReuglation && offeringReuglation === 'BD_506C');
    const { userDetails, setPartialInvestmenSession } = this.props.userDetailsStore;
    const userProfileFullStatus = userDetails && userDetails.status && userDetails.status === 'FULL' ? userDetails.status : 'PARTIAL';
    const offeringInvestnowURL = this.props.match.url;
    if (userProfileFullStatus !== 'FULL') {
      setPartialInvestmenSession(offeringInvestnowURL);
    } else {
      setPartialInvestmenSession();
    }
    const { currentUser } = this.props.userStore;
    const redirectURL = !isRegulationCheck ? currentUser && currentUser.roles && currentUser.roles.includes('investor') ?
      `${this.props.userDetailsStore.pendingStep}` : '/app/summary' : '/app/profile-settings/investment-limits';
    let headerToShow = (activeAccounts.length || investAccTypes.values.length) ? 'Which Investment Account would you like to invest from?' : frozenAccounts.length ? 'Your investment account is frozen for investments.' : 'You do not have a full investment account.';
    let subHeaderToShow = 'Choose an account type';
    const isParitalSectionNeedtoShow = !(partialAccounts.length && frozenAccounts.length);
    const { accreditationData, userAccredetiationState } = this.props.accreditationStore;
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
              {userAccredetiationState === 'ELGIBLE' || userAccredetiationState === '' || !isRegulationCheck ?
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
