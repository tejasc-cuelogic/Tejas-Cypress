import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form } from 'semantic-ui-react';
import { FormInput, MaskedInput } from '../../../../../../../theme/form';

@inject('uiStore', 'iraAccountStore')
@observer
export default class Beneficiary extends Component {
  render() {
    const { PRIMARY_BENEFICIARY_FRM, formChange, maskChange } = this.props.iraAccountStore;
    const form = PRIMARY_BENEFICIARY_FRM.fields.beneficiary[0];
    return (
      <Form error data-cy="cip-form">
        <Form.Group widths="equal">
          <FormInput
            key="name"
            type="text"
            name="name"
            fielddata={form.name}
            changed={(e, res) => formChange(e, res, 'PRIMARY_BENEFICIARY_FRM', 'name', 0)}
          />
          <FormInput
            key="relationship"
            type="text"
            name="relationship"
            fielddata={form.relationship}
            changed={(e, res) => formChange(e, res, 'PRIMARY_BENEFICIARY_FRM', 'relationship', 0)}
          />
          <MaskedInput
            name="dob"
            data-cy="dob"
            fielddata={form.dob}
            type="tel"
            format="##/##/####"
            changed={(e, res) => maskChange(e, res, 'PRIMARY_BENEFICIARY_FRM', 'dob', 0)}
            dateOfBirth
          />
        </Form.Group>
        {/* <AutoComplete
          name="street"
          fielddata={ID_VERIFICATION_FRM.fields.street}
          onplaceselected={place => setAddressFieldsForUserVerification(place, 'ID_VERIFICATION_FRM')}
          changed={(e, res) => formChange(e, res, 'PRIMARY_BENEFICIARY_FRM', 'debts', 0)}
          placeHolder="Street Address, City, State, Zip"
          data-cy="street"
        />
        <FormInput
          key="streetTwo"
          type="text"
          name="streetTwo"
          data-cy="streetTwo"
          fielddata={ID_VERIFICATION_FRM.fields.streetTwo}
          changed={(e, res) => formChange(e, res, 'PRIMARY_BENEFICIARY_FRM', 'debts', 0)}

        /> */}
        <Form.Group widths={3}>
          {/* <MaskedInput
            name="phoneNumber"
            data-cy="phoneNumber"
            type="tel"
            fielddata={ID_VERIFICATION_FRM.fields.phoneNumber}
            format="(###) ###-####"
            changed={(e, res) => maskChange(e, res, 'PRIMARY_BENEFICIARY_FRM', 'field', 0)}
            phoneNumber
          /> */}

          <MaskedInput
            name="share"
            fielddata={form.share}
            changed={(e, res) => maskChange(e, res, 'PRIMARY_BENEFICIARY_FRM', 'share', 0)}
          />

          <MaskedInput
            name="taxId"
            fielddata={form.taxId}
            ssn
            changed={(e, res) => maskChange(e, res, 'PRIMARY_BENEFICIARY_FRM', 'taxId', 0)}
          />
        </Form.Group>
        {/* <p className="note">
          By selecting <b>Verify my identity</b>, you agree NextSeed may deliver verification
                codes to you using the phone number you have provided. Codes may be sent using text
                messages, an autodialer, or artificial or prerecorded voice messages to such phone
                number. Your mobile carrier’s messaging and data fees may apply.
              </p>
        {errors
          && (
            <Message error className="mt-30">
              <ListErrors errors={errors.message ? [errors.message] : [errors]} />
            </Message>
          )
        }
        {ID_VERIFICATION_FRM.response.qualifiers
          && (
            <Message error className="mt-30">
              <CipErrors errorsList={ID_VERIFICATION_FRM.response.qualifiers} />
            </Message>
          )
        }
        <div className="mt-30 mb-20">
          <Button fluid={isMobile} primary content="Verify my identity" disabled={!ID_VERIFICATION_FRM.meta.isValid || signUpLoading} />
        </div>
        <div className={isMobile && 'center-align'}>
          <Link to="/dashboard/setup" onClick={cipUtility.closeModal}>I’ll finish this later</Link>
        </div> */}
      </Form>
    );
  }
}
