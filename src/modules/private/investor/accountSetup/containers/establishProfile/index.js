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
  render() {
    const { FINANCES, chkboxTicked } = this.props.investorProfileStore;
    return (
      <div>
        <Switch>
          <Route
            exact
            path={this.props.match.url}
            render={props =>
              (<AccountCreation
                close={this.handleCloseModal}
                {...props}
              />)}
          />
          <Route
            exact
            path={`${this.props.match.url}/fields-form`}
            render={props =>
              (<FieldsForm
                close={this.handleCloseModal}
                form={FINANCES}
                chkboxTicked={chkboxTicked}
                {...props}
              />)}
          />
        </Switch>
      </div>
    );
  }
}
