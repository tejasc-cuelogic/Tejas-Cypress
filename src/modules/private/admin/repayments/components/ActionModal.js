import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { isEmpty, get } from 'lodash';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import beautify from 'json-beautify';
import { MaskedInput } from '../../../../../theme/form';

function ActionModal(props) {
  const [response, setResponse] = useState({});
  const [showResponse, setShowResponse] = useState(false);
  useEffect(() => {
    props.paymentStore.resetForm('ACTION_FRM');
    props.paymentStore.validateForm('ACTION_FRM');
  }, [showResponse, response]);
  const paymentCtaHandlers = () => {
    props.paymentStore.paymentCtaHandlers('adminPaymentGenerateAdminSummary').then((res) => { setResponse(get(res, 'data.adminPaymentGenerateAdminSummary')); setShowResponse(true); });
  };
  const { ACTION_FRM, maskChange } = props.paymentStore;
  const { loadingArray } = props.nsUiStore;
  return (
    <Modal open={props.showActionModal} size="small" closeOnDimmerClick={false} closeIcon onClose={() => props.toggleVisibilityStatus('showActionModal')}>
      <Modal.Content>
        <Header as="h3">Generate Admin Summary</Header>
        <Form>
          <Form.Field width={4}>
            <MaskedInput
              name="date"
              placeHolder={ACTION_FRM.fields.date.placeHolder}
              fielddata={ACTION_FRM.fields.date}
              changed={(values, name) => maskChange(values, name, 'ACTION_FRM', 'formatted')}
              dateOfBirth
            />
          </Form.Field>
          <div className="center-align mt-30">
            <Button className="relaxed red" content="Cancel" onClick={() => props.toggleVisibilityStatus('showActionModal')} />
            <Button color="green relaxed" loading={loadingArray.includes('adminPaymentGenerateAdminSummary')} disabled={!ACTION_FRM.meta.isValid || loadingArray.includes('adminPaymentGenerateAdminSummary')} onClick={paymentCtaHandlers}>
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
                {beautify(response, null, 2, 100)}
              </pre>
              </>
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
