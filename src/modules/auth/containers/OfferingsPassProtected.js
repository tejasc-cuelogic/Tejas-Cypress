import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Button, Grid, Header } from 'semantic-ui-react';
import { activityActions } from '../../../services/actions';
import { FormCheckbox } from '../../../theme/form';

// import { get } from 'lodash';

@inject('authStore', 'uiStore')
@withRouter
@observer
class OfferingsPassProtected extends Component {
  // state = { password: '', error: '', previewPassLoader: false };

  constructor(props) {
    super(props);
    // this.state = { password: '', error: '' };
  }

  submit = () => {
    activityActions.devAppLogin({ password: this.state.password })
      .then(() => {
        activityActions.log({ action: 'LOGIN', status: 'SUCCESS' });
        this.props.authStore.setDevAppAuthStatus(true);
        const url = this.props.uiStore.passwordPreviewURL || '/';
        this.props.history.push(url);
        this.props.uiStore.setFieldvalue('passwordPreviewURL', null);
      })
      .catch(() => {
        activityActions.log({ action: 'LOGIN', status: 'FAIL' });
        this.setState({ error: 'Entered password is invalid, please try again.' });
      });
  }

  authPreviewOffer = () => {
    this.setState({ previewPassLoader: true });
    this.props.authStore.validateOfferingPreviewPassword(this.props.offeringSlug, this.state.password).then((status) => {
      if (status) {
        this.props.authPreviewOffer(true, this.state.password);
      } else {
        this.setState({ error: 'Entered password is invalid, please try again.' });
      }
      this.setState({ previewPassLoader: false });
    }).catch(() => this.setState({ previewPassLoader: false }));
  }

  render() {
    const headerMsg = 'This document is only available to accredited investors.';
    const paraMsg = <span>Please confirm that you are an accredited<br /> investor to view this document.</span>;
    return (!this.state.isSelfAccredited || !currentUser) ? (
      <section className={`no-updates center-align padded ${!currentUser ? 'pt-0 pb-0' : 'bg-offwhite'}`}>
        <Header as="h3" className="mb-20 mt-50">
          {headerMsg}
        </Header>
        {
          !currentUser
            ? <p>Please log in or create an account to view this document.</p>
            : <p>{paraMsg}</p>
        }
        {
          !currentUser
            ? <Button primary content="Log in / Sign Up" className="mt-20 mb-50" onClick={this.handleLoginAction} />
            : (
            <>
              {/* <Button as={Link} to="/dashboard/account-settings/investment-limits" primary content="Confirm Status" className="mt-20 mb-50" /> */}
              <Button primary content="Confirm Status" className="mt-20 mb-50" onClick={this.selfAccreditedHandle} />
            </>
              )}
      </section>
    ) : (
      <section className="no-updates padded plr-0">
        <Grid columns="2" stackable doubling>
          <Grid.Column>
            <Header as="h3" className="mb-20">
              {headerMsg}
            </Header>
            <p className="line-height-24">{paraMsg}</p>
          </Grid.Column>
          <Grid.Column>
            <FormCheckbox
              defaults
              fielddata={SELF_ACCREDITATION_FRM.fields.status}
              name="status"
              containerclassname="ui very relaxed list"
              changed={(e, res) => formChange(e, res, 'SELF_ACCREDITATION_FRM')}
              disabled={this.state.loading}
            />
            <Button loading={this.state.loading} primary content="Confirm" className="mt-20" disabled={SELF_ACCREDITATION_FRM.fields.status.value.length !== 2} onClick={e => this.investorSelfVerifyAccreditedStatus(e)} />
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}

export default OfferingsPassProtected;
