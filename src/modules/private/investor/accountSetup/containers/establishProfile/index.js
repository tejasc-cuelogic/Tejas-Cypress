import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import AccountCreation from './AccountCreation';
import FieldsForm from '../../components/establishProfile/FieldsForm';

@inject('investorProfileStore')
@withRouter
@observer
export default class EstablishProfile extends Component {
  handleCloseModal = () => {
    this.props.history.push('/app/summary');
  }
  handleCloseNestedModal = () => {
    this.props.history.push('/app/summary/establish-profile');
  }
  handleFormSubmit = () => {
    this.props.investorProfileStore.submitFieldsForm();
    this.props.history.push('/app/summary/establish-profile');
  }
  render() {
    const {
      FINANCES,
      canSubmitFieldsForm,
      financesChange,
      chkboxTicked,
    } = this.props.investorProfileStore;
    return (
      <div>
        <AccountCreation
          close={this.handleCloseModal}
          {...this.props}
        />
        <Switch>
          <Route
            exact
            path={`${this.props.match.url}/fields-form`}
            render={props =>
              (<FieldsForm
                canSubmitFieldsForm={canSubmitFieldsForm}
                close={this.handleCloseNestedModal}
                handleFormSubmit={this.handleFormSubmit}
                financesChange={financesChange}
                chkboxTicked={chkboxTicked}
                form={FINANCES}
                {...props}
              />)}
          />
        </Switch>
      </div>
    );
  }
}
