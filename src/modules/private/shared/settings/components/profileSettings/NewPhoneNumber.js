import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import isEmpty from 'lodash/isEmpty';
import { withRouter } from 'react-router-dom';
import { Header, Grid, Form, Button, Message, Divider } from 'semantic-ui-react';
import { MaskedInput, FormRadioGroup } from '../../../../../../theme/form';
import { ListErrors, NsModal } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('uiStore', 'identityStore', 'userDetailsStore')
@withRouter
@observer
export default class NewPhoneNumber extends Component {
  constructor(props) {
    super(props);
    const { userDetailsStore, identityStore } = this.props;
    if (userDetailsStore.userDetails.phone && userDetailsStore.userDetails.phone.type) {
      identityStore.phoneTypeChange(userDetailsStore.userDetails.phone.type);
    } else {
      identityStore.phoneTypeChange('TEXT');
    }
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.refLink);
    this.props.uiStore.clearErrors();
    this.props.identityStore.resetFormData('ID_VERIFICATION_FRM');
  }

  handleChangePhoneNumber = async () => {
    const { resetFormData, ID_VERIFICATION_FRM } = this.props.identityStore;
    resetFormData('ID_PHONE_VERIFICATION');
    const { phoneNumber, mfaMethod } = ID_VERIFICATION_FRM.fields;
    const phoneNumberValue = phoneNumber.value;
    const type = mfaMethod.value !== '' ? mfaMethod.value : 'NEW';
    const res = await this.props.identityStore.startPhoneVerification(type, phoneNumberValue, isMobile);
    if (res) {
      this.props.identityStore.setIsOptConfirmed(false);
      this.props.uiStore.clearErrors();
      this.props.history.push(`${this.props.refLink}/confirm`);
    }
  }

  render() {
    const {
      ID_VERIFICATION_FRM,
      personalInfoMaskedChange,
      personalInfoChange,
    } = this.props.identityStore;
    const { errors, inProgress } = this.props.uiStore;
    return (
      <NsModal open closeIcon onClose={this.handleCloseModal} closeOnDimmerClick={false}>
        <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
          <Grid.Column width="8" className="pt-0">
            <Header as="h3">Enter new phone number</Header>
            <Divider hidden />
            <p>We will send you a verification code to the phone number you provide.</p>
            <Form error onSubmit={this.handleChangePhoneNumber}>
              <MaskedInput
                name="phoneNumber"
                type="tel"
                fielddata={ID_VERIFICATION_FRM.fields.phoneNumber}
                format="(###) ###-####"
                changed={(values, name) => personalInfoMaskedChange(values, name, 'ID_VERIFICATION_FRM')}
                phoneNumber
              />
              <div className="field">
                <Header as="label">{ID_VERIFICATION_FRM.fields.mfaMethod.label}</Header>
                <FormRadioGroup
                  fielddata={ID_VERIFICATION_FRM.fields.mfaMethod}
                  name="mfaMethod"
                  containerclassname="mt-30 radio-basic"
                  widths="4"
                  changed={(e, result) => personalInfoChange(e, result, 'ID_VERIFICATION_FRM')}
                  classname="center-align"
                />
              </div>
              <div className="mt-30 mb-20">
                <Button primary content="Change Phone Number" loading={this.props.uiStore.inProgress} disabled={!!ID_VERIFICATION_FRM.fields.phoneNumber.error || isEmpty(ID_VERIFICATION_FRM.fields.phoneNumber.value) || inProgress} />
              </div>
              {errors
                && (
                  <Message error className="mt-20">
                    <ListErrors errors={errors.message ? [errors.message] : [errors]} />
                  </Message>
                )
              }
            </Form>
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}
