import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Form, Grid, Divider, Icon, Modal } from 'semantic-ui-react';
import OfferingButtonGroup from '../../OfferingButtonGroup';
import formHOC from '../../../../../../../theme/form/formHOC';
import ConfigPreview from './configPreview';
import CongratulationPreview from './CongratulationPreview';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'INVEST_NOW_CONFIG_FRM',
};

function ConfigDetails(props) {
  const [prev, setPrev] = useState(false);
  const [prevType, setPrevType] = useState(false);


  //   useEffect(() => {
  //     props.factoryStore.resetForm('INVEST_NOW_CONFIG_FRM');
  //     props.factoryStore.setFieldValue('inProgress', false, 'fileFactory');
  //   }, []);

  const onSubmit = () => {
    props.manageOfferingStore.updateConfig();
  };

  const togglePreivew = (e, type = '') => {
    e.preventDefault();
    setPrev(!prev);
    setPrevType(type);
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
        <Link to="#" onClick={e => togglePreivew(e)}>
          <Icon className="ns-view" /><b>Preview Investment Page</b>
        </Link>
        <Link to="#" className="ml-10" onClick={e => togglePreivew(e, 'confirmation')}>
          <Icon className="ns-view" /><b>Preview confirmation Page</b>
        </Link>
        <Form>
          <Modal
            closeIcon
            open={prev}
            onClose={e => togglePreivew(e)}
            closeOnEscape
            closeOnDimmerClick={false}
            size="large"
          >
            <Modal.Content className="multistep">
              {prevType !== 'confirmation'
                ? (
                  <Grid centered textAlign="left">
                    <Grid.Column mobile={16} tablet={10} computer={8}>
                      <ConfigPreview open={prev} />
                    </Grid.Column>
                  </Grid>
                )
                : <CongratulationPreview handleCloseModal={e => togglePreivew(e)} />
              }
            </Modal.Content>
          </Modal>
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
          <Grid className="mt-10">
            {smartElement.HtmlEditor('confirmationMessage', { displayMode: isReadOnly })}
          </Grid>
          <Grid className="mt-30">
            {smartElement.FormCheckBox('toggleConfirmation', { defaults: true, containerclassname: 'ui list field', label: 'Display Toggle' })}
          </Grid>
          {/* <Grid className="mt-20">
            {smartElement.FormCheckBox('hideConfirmationHeader', { displayMode: isReadOnly })}
          </Grid> */}
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
