import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { isEmpty, get } from 'lodash';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import beautify from 'json-beautify';
import { MaskedInput, FormRadioGroup, FormDropDown } from '../../../../../theme/form';

const title = {
  adminPaymentSendIssuerFirstNotice: 'Send First Notice Emails',
  adminPaymentSendIssuerSecondNotice: 'Send Second Notice Emails',
  adminPaymentGenerateAdminSummary: 'Generate Admin Summary',
  adminPaymentSendGoldStarDraftInstructions: 'Send GoldStar Draft Instructions',
  adminPaymentSendIssuerDraftNotice: 'Send Issuer Draft Notice',
};

function ActionModal(props) {
  const [response, setResponse] = useState({});
  const [showResponse, setShowResponse] = useState(false);
  const [showError, setShowError] = useState(null);
  useEffect(() => {
    props.paymentStore.manageActionDropdown(props.showActionModal);
    return () => {
      props.paymentStore.resetActionForm('ACTION_FRM');
      props.paymentStore.setFieldValue('sendEmailOptionVisibility', false);
      props.paymentStore.resetLoader(null, props.showActionModal);
    };
  }, []);
  useEffect(() => {
    props.paymentStore.validateForm('ACTION_FRM');
  }, [showResponse, response]);
  const paymentCtaHandlers = () => {
    props.paymentStore.paymentCtaHandlers(props.showActionModal).then((res) => {
      if (get(res, 'error')) {
        setShowError(get(res, 'error'));
      } else {
        setResponse(get(res, `data.${props.showActionModal}`));
      }
      setShowResponse(true);
    });
  };
  const { ACTION_FRM, maskChange, formChange, formActionDropdownChange, sendEmailOptionVisibility } = props.paymentStore;
  const { loadingArray } = props.nsUiStore;
  return (
    <Modal open={!!props.showActionModal} size="small" closeOnDimmerClick={false} closeIcon onClose={() => props.updateState('showActionModal', false)}>
      <Modal.Content>
        <Header as="h3">{title[props.showActionModal]}</Header>
        <Form>
          <Form.Field width={4}>
            <MaskedInput
              name="date"
              placeHolder={ACTION_FRM.fields.date.placeHolder}
              fielddata={ACTION_FRM.fields.date}
              changed={(values, name) => maskChange(values, name, 'ACTION_FRM', 'formatted')}
              dateOfBirth
            />
            <FormDropDown
              name="scope"
              fielddata={{ ...ACTION_FRM.fields.scope.values, error: undefined }}
              options={ACTION_FRM.fields.scope.values.map(s => ({ ...s, ...{ text: s.text } }))}
              onChange={(e, result) => formActionDropdownChange(e, result, 'ACTION_FRM')}
              search
              selection
              placeholder="Select"
            />
            {sendEmailOptionVisibility
              && (
                <div className="field">
                  <Header as="label">{ACTION_FRM.fields.sendEmail.label}</Header>
                  <FormRadioGroup
                    fielddata={ACTION_FRM.fields.sendEmail}
                    name="sendEmail"
                    changed={(e, result) => formChange(e, result, 'ACTION_FRM')}
                  />
                </div>
              )
            }
          </Form.Field>
          <div className="center-align mt-30">
            <Button className="relaxed red" content="Cancel" onClick={() => props.updateState('showActionModal', false)} />
            <Button color="green relaxed" loading={loadingArray.includes(props.showActionModal) && !showError} disabled={!ACTION_FRM.meta.isValid || (loadingArray.includes(props.showActionModal) && !showError)} onClick={paymentCtaHandlers}>
              Submit
            </Button>
          </div>
        </Form>
        {showResponse
          && (response && !isEmpty(response)
            ? (
              <>
                <Header as="h5">Response: </Header>
                <pre className="no-updates bg-offwhite padded json-text">
                  {beautify(response, null, 2, 30)}
                </pre>
              </>
            )
            : showError
              ? (
                <section className="bg-offwhite mb-20 center-align">
                  <Header as="h5">{showError}</Header>
                </section>
              )
              : (
                <section className="bg-offwhite mb-20 center-align">
                  <Header as="h5">No Response Available.</Header>
                </section>
              ))
        }
      </Modal.Content>
    </Modal>
  );
}

export default inject('paymentStore', 'nsUiStore')(observer(ActionModal));
