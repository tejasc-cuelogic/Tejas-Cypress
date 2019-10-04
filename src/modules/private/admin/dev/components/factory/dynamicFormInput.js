import React, { lazy, Suspense, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { Form, Header } from 'semantic-ui-react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { InlineLoader } from '../../../../../../theme/shared';

const getFields = component => lazy(() => import(`../../../../../../theme/form/src/${component}`));

let FormTag = '';

// function formPropsAreEqual(prevForm, nextForm) {
//   console.log('Size==>1', size(prevForm.formPayload));
//   console.log('Size==>2', size(nextForm.formPayload));
//   return size(prevForm.formPayload) === size(nextForm.formPayload);
// }

const DynamicFormInput = React.memo((props) => {
  function getFormInput(fieldKey, formProps) {
    const { formChange, getFormElement, REQUESTFACTORY_FRM } = props.factoryStore;
    const additionalProps = { containerclassname: 'secondary huge' };
    const elementProps = formProps.type === 'textarea' && additionalProps;
    useEffect(() => {
      const formInputData = getFormElement(fieldKey, formProps, props.formObj);
      const formElementType = formInputData;
      FormTag = getFields(formElementType);
    }, [REQUESTFACTORY_FRM.fields.plugin.value]);
    if (FormTag === '') {
      return (<InlineLoader />);
    }
    return (
      <FormTag
        {...elementProps}
        name={fieldKey}
        fielddata={formProps}
        changed={(e, result) => formChange(e, result, props.formObj, true)}
      />
    );
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
                {Object.keys(formPayload.fields).map(val => (
                  getFormInput(val, formPayload.fields[val])
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
});

export default inject('factoryStore')(withRouter(DynamicFormInput));

// export default inject('factoryStore')(withRouter(observer(DynamicFormInput)));
