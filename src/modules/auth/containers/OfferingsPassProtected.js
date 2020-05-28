import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Button, Form, Grid, Header, Modal } from 'semantic-ui-react';
import { activityActions } from '../../../services/actions';
import { FieldError } from '../../../theme/shared';
import { FormCheckbox } from '../../../theme/form';

@inject('authStore', 'uiStore', 'accreditationStore')
@withRouter
@observer
class OfferingsPassProtected extends Component {
  state = { password: '', error: '', previewPassLoader: false, openModal: true };

  constructor(props) {
    super(props);
    this.state = { password: '', error: '', openModal: true };
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
        this.props.authStore.setUserPrivateAccess(true);
      } else {
        this.setState({ error: 'Access code is invalid. Please try again, or request the access code from the issuer.' });
      }
      this.setState({ previewPassLoader: false });
    }).catch(() => this.setState({ previewPassLoader: false }));
  }

  closeModal = () => {
    this.setState({ openModal: false });
    this.props.history.push(`/offerings`);
  }

  render() {
    const { SELF_ACCREDITATION_PRIVATE_FRM, formChange } = this.props.accreditationStore;
    const headerMsg = `This is a private offering for ${this.props.offeringSlug} that is only available to accredited investors.`;
    const paraMsg = <span>Please confirm that you are an accredited<br /> investor and enter in the access code<br /> provided by the issuer.</span>;
    const isDisabled = !SELF_ACCREDITATION_PRIVATE_FRM.fields.status.value.length || !this.state.password;
    return (
      <>
        <Modal size="large" className="acc-investor-modal" open={this.state.openModal} closeIcon onClose={this.closeModal}>
          <Modal.Content>
            <section className="no-updates padded plr-0">
              <Grid columns="2" stackable doubling>
                <Grid.Column>
                  <Header as="h4" className="mb-20">
                    {headerMsg}
                  </Header>
                  <p className="line-height-24">{paraMsg}</p>
                </Grid.Column>
                <Grid.Column>
                  <Form onSubmit={this.props.offerPreview ? this.authPreviewOffer : this.submit}>
                    <FormCheckbox
                      defaults
                      fielddata={SELF_ACCREDITATION_PRIVATE_FRM.fields.status}
                      name="status"
                      containerclassname="ui very relaxed list"
                      changed={(e, res) => formChange(e, res, 'SELF_ACCREDITATION_PRIVATE_FRM')}
                      disabled={this.state.loading}
                    />
                    <Form.Input
                      onChange={e => this.setState({ password: e.target.value, error: '' })}
                      fluid
                      placeholder="Please enter access code here"
                      label="Access Code"
                      value={this.state.password}
                      type="password"
                      autoFocus
                      name="password"
                      error={this.state.error}
                    />
                    <FieldError error={this.state.error} />
                    <Button loading={this.state.previewPassLoader} primary content="Confirm" className="mt-20" disabled={isDisabled || this.state.previewPassLoader} />
                  </Form>
                </Grid.Column>
              </Grid>
            </section>
          </Modal.Content>
        </Modal>
      </>
    );
  }
}

export default OfferingsPassProtected;
