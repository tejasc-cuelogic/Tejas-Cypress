import React, { Component } from 'react';
import Aux from 'react-aux';
import { includes } from 'lodash';
import { Header, Form, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { FormRadioGroup } from '../../../../../theme/form';

@inject('investmentStore', 'userDetailsStore', 'investmentLimitStore')
@withRouter
@observer
class AccountType extends Component {
  componentWillMount() {
    const {
      byDefaultRender,
      setStepToBeRendered,
      getSelectedAccountTypeId,
    } = this.props.investmentStore;
    const { UserAccounts } = this.props;
    if (!byDefaultRender) {
      setStepToBeRendered(2);
    } else if (this.props.changeInvest || (UserAccounts && UserAccounts.length === 1)) {
      const accountType = this.props.changeInvest ? includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity' : UserAccounts[0];
      this.props.investmentStore.accTypeChanged(null, { value: accountType });
      if (getSelectedAccountTypeId) {
        setStepToBeRendered(1);
      }
    }
  }
  componentDidMount() {
    const {
      setStepToBeRendered,
      setFieldValue,
      byDefaultRender,
      getSelectedAccountTypeId,
    } = this.props.investmentStore;
    if (getSelectedAccountTypeId) {
      this.props.investmentLimitStore.getInvestorInvestmentLimit();
    }
    const { UserAccounts } = this.props;
    if (!byDefaultRender) {
      setStepToBeRendered(2);
    } else if (UserAccounts && UserAccounts.length === 1) {
      setFieldValue('disableNextbtn', false);
      setStepToBeRendered(1);
    }
  }
  radioChnaged = (e, res) => {
    this.setState({ investAccountType: { ...this.state.investAccountType, value: res.value } });
  }
  render() {
    const { UserAccounts } = this.props;
    const {
      accTypeChanged,
      investAccTypes,
      prepareAccountTypes,
    } = this.props.investmentStore;
    prepareAccountTypes(UserAccounts);
    return (
      <Aux>
        <Header as="h3" textAlign="center">Which Investment Account would you like to invest from?</Header>
        <Form error className="account-type-tab">
          {investAccTypes.values.length ?
            <Aux>
              <p className="center-align">Choose an account type</p>
              <FormRadioGroup
                name="investAccountType"
                containerclassname="button-radio center-align"
                fielddata={investAccTypes}
                changed={accTypeChanged}
              />
            </Aux>
            :
            <div className="center-align">
              <p>Investment accounts are not yet created!</p>
              <Link to="/app/summary" className="text-link">
                <Icon className="ns-arrow-right" color="green" />
                Go to My Accounts
              </Link>
            </div>
          }
        </Form>
      </Aux>
    );
  }
}
export default AccountType;
