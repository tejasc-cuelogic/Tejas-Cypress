import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Divider } from 'semantic-ui-react';
import OfferingButtonGroup from '../../OfferingButtonGroup';
import formHOC from '../../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'INVEST_NOW_TOC_FRM',
};

function InvestNowAddToc(props) {
  useEffect(() => {
    const { resetForm } = props.manageOfferingStore;
    return () => {
      resetForm('INVEST_NOW_TOC_FRM');
    };
  }, []);
  const handleFormSubmit = () => {
    const { updateOffering, investNowAddData } = props.manageOfferingStore;
    const offeringData = investNowAddData({ form: 'INVEST_NOW_TOC_FRM', regulation: props.regulation, page: props.page });
    updateOffering({ keyName: 'investNow', offeringData, cleanData: true });
  };

  const { smartElement, manageOfferingStore } = props;
  const { INVEST_NOW_TOC_FRM } = manageOfferingStore;
  return (
    <div className="inner-content-spacer">
      <Form>
        {smartElement.FormDropDown('account')}
        {smartElement.RadioGroup('required')}
        {smartElement.TextArea('label')}
        <Divider hidden />
          <OfferingButtonGroup
            buttonTitle="Create"
            updateOffer={handleFormSubmit}
            isDisable={!INVEST_NOW_TOC_FRM.meta.isValid}
          />
      </Form>
    </div>
  );
}

export default withRouter(formHOC(observer(InvestNowAddToc), metaInfo));
