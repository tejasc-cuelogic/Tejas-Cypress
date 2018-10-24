import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Form, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { FormRadioGroup } from '../../../../../theme/form';

@inject('investmentStore', 'userDetailsStore')
@observer
class AccountType extends Component {
  componentWillMount() {
    const { setStepToBeRendered } = this.props.investmentStore;
    const { UserAccounts } = this.props;
    if (UserAccounts && UserAccounts.length === 1) {
      setStepToBeRendered(2);
    }
  }
  componentDidMount() {
    const {
      investAccTypes,
      setStepToBeRendered,
      setDisableNextbtn,
    } = this.props.investmentStore;
    if (investAccTypes.values.length === 0) {
      setDisableNextbtn();
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
              <p>Investment Accounts are not yet Created!</p>
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
