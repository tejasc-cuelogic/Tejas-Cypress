import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Form, Divider } from 'semantic-ui-react';
import OfferingButtonGroup from '../../OfferingButtonGroup';
import formHOC from '../../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'INVEST_NOW_TOC_FRM',
};

function InvestNowAddToc(props) {
  useEffect(() => {
    const { manageOfferingStore, type, page, regulation, tocIndex } = props;
    const { resetForm, setFormDataV2 } = manageOfferingStore;
    if (type === 'TOC_EDIT') {
      setFormDataV2({ type, page, regulation, tocIndex });
    }
    return () => {
      resetForm('INVEST_NOW_TOC_FRM');
    };
  }, []);
  const handleFormSubmit = () => {
    const { manageOfferingStore, type, page, regulation, tocIndex } = props;
    const { updateOffering, investNowAddData } = manageOfferingStore;
    let offeringData;
    if (type === 'TOC_EDIT') {
      offeringData = investNowAddData({ form: 'INVEST_NOW_TOC_FRM', regulation, page, tocIndex, type });
    } else {
      offeringData = investNowAddData({ form: 'INVEST_NOW_TOC_FRM', regulation, page });
    }
    updateOffering({ keyName: 'investNow', offeringData, cleanData: true });
  };

  const { smartElement, manageOfferingStore, type } = props;
  const { INVEST_NOW_TOC_FRM } = manageOfferingStore;
  const isReadOnly = false;
  return (
    <div className="inner-content-spacer">
      <Form>
        {smartElement.FormDropDown('account', { fielddata: INVEST_NOW_TOC_FRM.fields.account, containerclassname: 'dropdown-field', displayMode: isReadOnly })}
        {smartElement.RadioGroup('required', { fielddata: INVEST_NOW_TOC_FRM.fields.required, displayMode: isReadOnly })}
        {smartElement.TextArea('label', { fielddata: INVEST_NOW_TOC_FRM.fields.label, displayMode: isReadOnly })}
        <Divider hidden />
        {!isReadOnly
          && (
            <OfferingButtonGroup
              buttonTitle={['TOC_EDIT'].includes(type) ? 'Update' : 'Create'}
              updateOffer={handleFormSubmit}
              isDisable={!INVEST_NOW_TOC_FRM.meta.isValid}
            />
          )}
      </Form>
    </div>
  );
}

export default formHOC(observer(InvestNowAddToc), metaInfo);
