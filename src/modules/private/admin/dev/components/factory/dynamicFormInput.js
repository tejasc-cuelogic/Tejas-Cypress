import React, { Suspense, lazy } from 'react';
// import { isEmpty } from 'lodash';
import { Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
// import { FormInput } from '../../../../../../theme/form';
import { InlineLoader } from '../../../../../../theme/shared';

const getFields = () => lazy(() => import('../../../../../../theme/form'));

let FormTag = '';

function DynamicFormInput(props) {
  // useEffect(() => {
  //   props.factoryStore.resetForm('PROCESSACTORY_FRM');
  //   props.factoryStore.setFieldValue('inProgress', false, 'processFactory');
  //   props.factoryStore.setFieldValue('processFactoryResponse', {});
  // }, []);

  function getFormInput(formProps) {
    const { formChange } = props.factoryStore;
    FormTag = getFields('FormInput');
    return (
      <FormTag
        name={formProps.label}
        fielddata={formProps}
        changed={(e, result) => formChange(e, result, 'DYNAMCI_PAYLOAD_FRM')}
      />
    );
  }

  const { factoryStore } = props;
  const { DYNAMCI_PAYLOAD_FRM } = factoryStore;
  return (
    <>
      <Suspense fallback={<InlineLoader />}>
        {
          DYNAMCI_PAYLOAD_FRM && DYNAMCI_PAYLOAD_FRM.fields ? (DYNAMCI_PAYLOAD_FRM.fields.map(exp => (
            <>
              <div className="featured-section">
                <Form.Group widths={2}>
                  {
                    getFormInput(exp)
                  }
                </Form.Group>
              </div>
            </>
          ))
          ) : (<div>No payload found...</div>)
        }
      </Suspense>
    </>
  );
}

export default inject('factoryStore')(withRouter(observer(DynamicFormInput)));
