import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Form, Header } from 'semantic-ui-react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { InlineLoader, SuspenseBoundary, lazyRetry } from '../../../../../../theme/shared';

const getFields = component => lazyRetry(() => import(`../../../../../../theme/form/src/${component}`));

let FormTag = '';

const DynamicFormInput = React.memo((props) => {
  function getFormInput(fieldKey, formProps) {
    const { formChangeForPlugin, getFormElement } = props.factoryStore;
    const additionalProps = formProps.type === 'textarea' ? { containerclassname: 'secondary huge' } : formProps.type === 'select' ? { selection: 'selection', options: formProps.options, onChange: (e, result) => formChangeForPlugin(e, result, props.formObj, true), placeholder: formProps.placeHolder || '' } : {};
    const elementProps = ['textarea', 'select'].includes(formProps.type) && additionalProps;
    const formInputData = getFormElement(fieldKey, formProps, props.formObj);
    const formElementType = formInputData;
    FormTag = getFields(formElementType);
    return (
      <FormTag
        {...elementProps}
        name={fieldKey}
        fielddata={formProps}
        changed={(e, result) => formChangeForPlugin(e, result, props.formObj, true)}
      />
    );
  }

  function loadFormElements(formPayload) {
    const [elem, setElem] = useState([]);
    const elementArr = [];
    useEffect(() => {
      Object.keys(formPayload.fields).map(val => (
        elementArr.push(getFormInput(val, formPayload.fields[val]))
      ));
      setElem(elementArr);
    }, [props.selectedPlugin]);
    return elem;
  }

  const { formPayload } = props;
  const tempFormPAyload = { ...formPayload };

  return (
    <>
      {
        tempFormPAyload && tempFormPAyload.fields && !isEmpty(tempFormPAyload.fields) ? (
          <div className="featured-section">
            <SuspenseBoundary>
              <Header as="h6">Note: Below field(s) are prefilled with dummy values.</Header>
              <Form>
                {loadFormElements(tempFormPAyload)}
              </Form>
            </SuspenseBoundary>
          </div>
        )
          : <InlineLoader text="No payload found..." />
      }
    </>
  );
});

export default inject('factoryStore')(withRouter(DynamicFormInput));
