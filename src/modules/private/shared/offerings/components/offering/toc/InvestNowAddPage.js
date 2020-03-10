import React from 'react';
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
  const handleFormSubmit = () => {
    const { updateOffering, investNowAddData } = props.manageOfferingStore;
    const offeringData = investNowAddData({ form: 'INVEST_NOW_PAGE_FRM', regulation: props.regulation });
    updateOffering({ keyName: 'investNow', offeringData, cleanData: true });
  };

  const { smartElement, manageOfferingStore } = props;
  const { INVEST_NOW_PAGE_FRM } = manageOfferingStore;
  const isReadOnly = false;
  return (
    <div className="inner-content-spacer">
      <Form>
        {/* {smartElement.Masked('page', { displayMode: isReadOnly })} */}
        {smartElement.Input('title', { displayMode: isReadOnly })}
        {/* {smartElement.FormDropDown('regulation', { displayMode: isReadOnly })} */}
        <Divider hidden />
        {!isReadOnly
          && (
            <OfferingButtonGroup
              updateOffer={handleFormSubmit}
              isDisable={!INVEST_NOW_PAGE_FRM.meta.isValid}
            />
          )}
      </Form>
    </div>
  );
}

export default withRouter(formHOC(observer(InvestNowAddPage), metaInfo));
