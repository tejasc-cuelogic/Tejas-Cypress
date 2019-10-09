import React, { lazy, Suspense, useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Form, Header } from 'semantic-ui-react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { InlineLoader } from '../../../../../../theme/shared';

const getFields = component => lazy(() => import(`../../../../../../theme/form/src/${component}`));

let FormTag = '';

const DynamicFormInput = React.memo((props) => {
  function getFormInput(fieldKey, formProps) {
    const { formChangeForPlugin, getFormElement } = props.factoryStore;
    const additionalProps = { containerclassname: 'secondary huge' };
    const elementProps = formProps.type === 'textarea' && additionalProps;
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

  function loadEmptyStatement() {
    return (<InlineLoader text="No payload found..." />);
  }

  const { formPayload } = props;
  return (
    <>
      {
        formPayload && formPayload.fields && !isEmpty(formPayload.fields) ? (
          <div className="featured-section">
            <Suspense fallback={<InlineLoader />}>
              <Header as="h6">Note: Below field/s are prefilled with dummy values.</Header>
              <Form>
                {loadFormElements(formPayload)}
              </Form>
            </Suspense>
          </div>
        )
          : loadEmptyStatement()
      }
    </>
  );
});

export default inject('factoryStore')(withRouter(DynamicFormInput));
