import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Card, Form, Grid, Button } from 'semantic-ui-react';
import { get } from 'lodash';
import formHOC from '../../../../../../../theme/form/formHOC';
import { InlineLoader } from '../../../../../../../theme/shared';


const metaInfo = {
  store: 'factoryStore',
  form: 'FILEFACTORY_FRM',
};

function GenerateDocuments(props) {
  useEffect(() => {
    props.factoryStore.resetForm('FILEFACTORY_FRM');
    props.factoryStore.setFieldValue('inProgress', false, 'fileFactory');
  }, []);

  const onSubmit = () => {
    props.factoryStore.fileFactoryPluginTrigger(true);
  };

  const handleDocumentsLink = (e, folderId) => {
    e.preventDefault();
    const { offer } = props.offeringsStore;
    const params = {
      id: folderId,
      accountType: (get(offer, 'regulation') && get(offer, 'regulation').includes('BD')) ? 'SECURITIES' : 'SERVICES',
      type: 'FOLDERS',
    };
    props.commonStore.getsharedLink(params).then((shareLink) => {
      window.open(shareLink);
    });
  };

  const { factoryStore, smartElement, offeringsStore } = props;
  const {
    FILEFACTORY_FRM, formChangeForPlugin, inProgress,
  } = factoryStore;
  const { offeringStorageDetails } = offeringsStore;
  const isDocGenerationValid = !!(FILEFACTORY_FRM.fields.method.values.length > 0);
  const isPreview = !!(get(offeringStorageDetails, 'data.getOfferingDetailsBySlug.storageDetails.Legal.GeneratedInvestNowDocs.id') && isDocGenerationValid);
  const folderId = get(offeringStorageDetails, 'data.getOfferingDetailsBySlug.storageDetails.Legal.GeneratedInvestNowDocs.id');
  return (
    <>
      <Grid>
        <Grid.Column>
          <Card fluid className="elastic-search">
            <Card.Content header="Generate Document" />
            <Card.Content>
              <Card.Description>
                <Form onSubmit={FILEFACTORY_FRM.meta.isValid && onSubmit}>
                  <Form.Group className="bottom-aligned">
                    <Form.Field width={12}>
                      {!isDocGenerationValid
                        ? (
                          <InlineLoader text="No DocGen supported for this security type" />
                        )
                        : (smartElement.FormDropDown('method', {
                          onChange: (e, result) => formChangeForPlugin(e, result, 'FILEFACTORY_FRM'),
                          containerclassname: 'dropdown-field mlr-0',
                          placeholder: 'Choose here',
                          options: FILEFACTORY_FRM.fields.method.values,
                          className: 'mb-80',
                          containerwidth: 11,
                        })
                        )
                      }
                    </Form.Field>
                    <Form.Field width={4}>
                      <Button primary content="Generate" disabled={inProgress.fileFactory || !FILEFACTORY_FRM.meta.isValid} loading={inProgress.fileFactory} />
                      {isPreview
                        && (
                          <Button secondary content="Preview" onClick={e => handleDocumentsLink(e, folderId)} disabled={props.commonStore.inProgress === folderId || inProgress.fileFactory} loading={props.commonStore.inProgress === folderId} />
                        )
                      }
                    </Form.Field>
                  </Form.Group>
                </Form>
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </>
  );
}

export default inject('offeringsStore', 'commonStore')(withRouter(formHOC(observer(GenerateDocuments), metaInfo)));
