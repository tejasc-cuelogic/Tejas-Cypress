import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Form, Divider } from 'semantic-ui-react';
import { activityActions } from '../../../services/actions';
import { Logo, FieldError } from '../../../theme/shared';

@inject('authStore', 'uiStore')
@withRouter
@observer
class OfferingsPassProtected extends Component {
  state = { password: '', error: '', previewPassLoader: false };

  constructor(props) {
    super(props);
    this.state = { password: '', error: '' };
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
    return (
      <>
        <Modal size="mini" basic open className="multistep-modal">
          <Logo size="medium" centered dataSrc="LogoWhiteGreen" />
          <Divider hidden />
          <Modal.Content className="signup-modal multistep">
            <Form onSubmit={this.props.offerPreview ? this.authPreviewOffer : this.submit}>
              <Form.Input
                onChange={e => this.setState({ password: e.target.value, error: '' })}
                fluid
                placeholder="Please enter password here"
                label="Password"
                value={this.state.password}
                type="password"
                autoFocus
                name="password"
                error={this.state.error}
              />
              <FieldError error={this.state.error} />
              <div className="center-align">
                <Button disabled={!this.state.password} primary size="large" className="very relaxed" loading={this.state.previewPassLoader}>{this.props.offerPreview ? 'Continue' : 'Log in'}</Button>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      </>
    );
  }
}

export default OfferingsPassProtected;
