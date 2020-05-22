import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Grid, Divider } from 'semantic-ui-react';
import OfferingButtonGroup from '../../OfferingButtonGroup';
import formHOC from '../../../../../../../theme/form/formHOC';
import ConfigPreview from './configPreview';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'INVEST_NOW_CONFIG_FRM',
};

function ConfigDetails(props) {
  //   useEffect(() => {
  //     props.factoryStore.resetForm('INVEST_NOW_CONFIG_FRM');
  //     props.factoryStore.setFieldValue('inProgress', false, 'fileFactory');
  //   }, []);

  const onSubmit = () => {
    props.manageOfferingStore.updateConfig();
  };

  const { smartElement, manageOfferingStore, uiStore } = props;
  const { inProgress } = uiStore;
  const {
    INVEST_NOW_CONFIG_FRM,
  } = manageOfferingStore;
  const isReadOnly = false;
  return (
    <>
      <div className="inner-content-spacer">
        <Form>
          <Divider section />
          <ConfigPreview />
          <Divider section />
          <Grid>
            {smartElement.RadioGroup('investmentType', { displayMode: isReadOnly })}
          </Grid>
          <Grid columns="2">
            <Grid.Column>
              {smartElement.FormCheckBox('toggleMeta', { defaults: true, containerclassname: 'ui list field', label: 'Display Toggle' })}
            </Grid.Column>
            {INVEST_NOW_CONFIG_FRM.fields.toggleMeta.value.includes('EXPECTED_RETURN') && (
              <Grid.Column>
                {smartElement.FormDropDown('expectedReturnCalc', { displayMode: isReadOnly })}
              </Grid.Column>
            )}
          </Grid>
          <Divider section />
          <OfferingButtonGroup
            updateOffer={onSubmit}
            isDisable={!INVEST_NOW_CONFIG_FRM.meta.isValid || inProgress === 'save'}
          />
        </Form>
      </div>
    </>
  );
}

export default inject('uiStore')(withRouter(formHOC(observer(ConfigDetails), metaInfo)));
