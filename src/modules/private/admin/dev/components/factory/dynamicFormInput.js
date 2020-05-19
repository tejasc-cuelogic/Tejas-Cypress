import React, { useEffect, useState } from 'react';
import { isEmpty, get, pick } from 'lodash';
import { Form, Header } from 'semantic-ui-react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { InlineLoader, SuspenseBoundary, lazyRetry } from '../../../../../../theme/shared';

const getFields = component => lazyRetry(() => import(`../../../../../../theme/form/src/${component}`));

let FormTag = '';

const DynamicFormInput = React.memo((props) => {
  function getFormInput(fieldKey, formProps) {
    const { formChangeForPlugin, getFormElement } = props.factoryStore;
    const additionalProps = formProps.type === 'textarea' ? { containerclassname: 'secondary huge' } : formProps.type === 'select' ? { selection: 'selection', options: formProps.options.map(o => pick(o, ['key', 'value', 'text'])), onChange: (e, result) => formChangeForPlugin(e, result, props.formObj, true, { listType: props.listType, selectedPlugin: props.selectedPlugin }), placeholder: formProps.placeHolder || '' } : {};
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
      props.factoryStore.getPluginByType(props.listType, props.selectedPlugin);
      setElem(elementArr);
    }, [props.selectedPlugin]);
    return elem;
  }

  const { formPayload, pluginObj } = props;
  const tempFormPAyload = { ...formPayload };

  return (
    <>
      {

        tempFormPAyload && tempFormPAyload.fields && !isEmpty(tempFormPAyload.fields) ? (
          <>

            {get(pluginObj, 'note')
              && (
                <Header as="h5">Note: <span>{pluginObj.note}</span>
                </Header>
              )}

            {get(pluginObj, 'note')
              && (
                <Header as="h5">Description: <span>{pluginObj.description}</span>
                </Header>
              )}
            <Header as="h5">Payload</Header>
            <div className="featured-section">
              <SuspenseBoundary>
                <Header as="h6">Note: Below field(s) are prefilled with dummy values.</Header>
                <Form>
                  {loadFormElements(tempFormPAyload)}
                </Form>
              </SuspenseBoundary>
            </div>
          </>
        )
          : <InlineLoader text="No payload found..." />
      }
    </>
  );
});

export default inject('factoryStore')(withRouter(DynamicFormInput));
