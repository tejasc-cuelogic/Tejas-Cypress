import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Divider, Form, Button, Grid } from 'semantic-ui-react';
import { FormRadioGroup } from '../../../../../../theme/form';
import { NsModal } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('multiFactorAuthStore', 'uiStore', 'identityStore')
@withRouter
@observer
export default class ManageMultiFactorAuth extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.isExact) {
      this.props.multiFactorAuthStore.initialiseMfaMode();
    }
  }

  submit = async (e) => {
    e.preventDefault();
    await this.props.multiFactorAuthStore.updateUserMFA();
    if (this.props.mfaType) {
      const res = await this.props.identityStore.sendOtp(this.props.mfaType);
      if (res) {
        this.props.history.push(this.props.refLink);
      }
    } else {
      this.props.history.push(this.props.refLink);
    }
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.refLink);
  }

  render() {
    const {
      MFA_MODE_TYPE_META,
      handleMfaModeTypeChanged,
    } = this.props.multiFactorAuthStore;
    const { inProgress } = this.props.uiStore;
    return (
      <div>
        <NsModal open closeIcon onClose={this.handleCloseModal} closeOnDimmerClick={false}>
          <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
            <Grid.Column mobile={16} tablet={10} computer={8} className="pt-0">
              <Header as="h3">Your active MFA factor</Header>
              <Divider />
              <p>
                All major actions will require additional confirmation with
                the code that we will send to your phone or email address.
            </p>
              <Header as="h4">Where do you want to get<br />the confirmation codes?</Header>
              <Form onSubmit={this.submit} className="account-type-tab">
                <FormRadioGroup
                  fielddata={MFA_MODE_TYPE_META.fields.mfaModeTypes}
                  name="mfaModeTypes"
                  changed={handleMfaModeTypeChanged}
                  containerclassname="center-align radio-basic"
                  widths="equal"
                />
                <div className="mt-30 mb-20 center-align">
                  <Button loading={inProgress} disabled={!MFA_MODE_TYPE_META.meta.isValid} primary size="large" className="very relaxed">Select</Button>
                </div>
              </Form>
            </Grid.Column>
          </Grid>
        </NsModal>
      </div>
    );
  }
}
