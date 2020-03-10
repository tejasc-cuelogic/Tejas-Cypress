import React from 'react';
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
  const handleFormSubmit = () => {
    const { updateOffering, investNowAddData } = props.manageOfferingStore;
    const offeringData = investNowAddData({ form: 'INVEST_NOW_TOC_FRM', regulation: props.regulation, page: props.page });
    updateOffering({ keyName: 'investNow', offeringData, cleanData: true });
  };

  const { smartElement, manageOfferingStore } = props;
  const { INVEST_NOW_TOC_FRM } = manageOfferingStore;
  const isReadOnly = false;
  return (
    <div className="inner-content-spacer">
      <Form>
        {smartElement.FormDropDown('account', { displayMode: isReadOnly })}
        {smartElement.RadioGroup('required', { displayMode: isReadOnly })}
        {smartElement.TextArea('label', { displayMode: isReadOnly })}
        <Divider hidden />
        {!isReadOnly
          && (
            <OfferingButtonGroup
              updateOffer={handleFormSubmit}
              isDisable={!INVEST_NOW_TOC_FRM.meta.isValid}
            />
          )}
      </Form>
    </div>
  );
}

export default withRouter(formHOC(observer(InvestNowAddToc), metaInfo));
