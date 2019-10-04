import React, { lazy, Suspense } from 'react';
import { isEmpty } from 'lodash';
import { Form, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { InlineLoader } from '../../../../../../theme/shared';

const getFields = component => lazy(() => import(`../../../../../../theme/form/src/${component}`));

let FormTag = '';

function DynamicFormInput(props) {
  function getFormInput(fieldKey, formProps) {
    const { formChange, getFormElement } = props.factoryStore;
    const additionalProps = { containerclassname: 'secondary huge' };
    const elementProps = formProps.type === 'textarea' && additionalProps;
    const formInputData = getFormElement(fieldKey, formProps, 'DYNAMCI_PAYLOAD_FRM');
    const formElementType = formInputData;
    FormTag = getFields(formElementType);
    return (
      <FormTag
        {...elementProps}
        name={fieldKey}
        fielddata={formProps}
        changed={(e, result) => formChange(e, result, 'DYNAMCI_PAYLOAD_FRM')}
      />
    );
  }

  const { factoryStore } = props;
  const { DYNAMCI_PAYLOAD_FRM } = factoryStore;
  return (
    <>
      {
        DYNAMCI_PAYLOAD_FRM && DYNAMCI_PAYLOAD_FRM.fields && !isEmpty(DYNAMCI_PAYLOAD_FRM.fields) ? (
          <div className="featured-section">
            <Suspense fallback={<InlineLoader />}>
            <Header as="h6">Note: Below field/s are prefilled with dummy values.</Header>
              <Form>
                {Object.keys(DYNAMCI_PAYLOAD_FRM.fields).map(val => (
                  getFormInput(val, DYNAMCI_PAYLOAD_FRM.fields[val])
                ))
                }
              </Form>
            </Suspense>
          </div>
        )
          : (<InlineLoader text="No payload found..." />)
      }
    </>
  );
}

export default inject('factoryStore')(withRouter(observer(DynamicFormInput)));