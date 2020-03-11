import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Divider } from 'semantic-ui-react';
import OfferingButtonGroup from '../../OfferingButtonGroup';
import formHOC from '../../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'INVEST_NOW_PAGE_FRM',
};

function InvestNowAddPage(props) {
  useEffect(() => {
    const { manageOfferingStore, type, page, regulation, tocIndex } = props;
    const { resetForm, setFormDataV2 } = manageOfferingStore;
    if (type === 'PAGE_EDIT') {
      setFormDataV2({ type, page, regulation, tocIndex });
    }
    return () => {
      resetForm('INVEST_NOW_PAGE_FRM');
    };
  }, []);

  const handleFormSubmit = () => {
    const { updateOffering, investNowAddData } = props.manageOfferingStore;
    const offeringData = investNowAddData({ form: 'INVEST_NOW_PAGE_FRM', regulation: props.regulation });
    updateOffering({ keyName: 'investNow', offeringData, cleanData: true });
  };

  const { smartElement, manageOfferingStore } = props;
  const { INVEST_NOW_PAGE_FRM } = manageOfferingStore;
  return (
    <div className="inner-content-spacer">
      <Form>
        {smartElement.Input('title', { fielddata: INVEST_NOW_PAGE_FRM.fields.title })}
        <Divider hidden />
          <OfferingButtonGroup
            buttonTitle="Create"
            updateOffer={handleFormSubmit}
          />
      </Form>
    </div>
  );
}

export default withRouter(formHOC(observer(InvestNowAddPage), metaInfo));
