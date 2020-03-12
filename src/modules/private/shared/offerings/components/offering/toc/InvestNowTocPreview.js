import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { Header, Button, Grid, Form, Modal } from 'semantic-ui-react';
import { FormCheckbox } from '../../../../../../../theme/form';

function InvestNowTocPreview(props) {
  useEffect(() => {
    const { agreementsStore, callbackFun, regulation, page } = props;
    const { previewAgreementTocs } = agreementsStore;
    previewAgreementTocs(regulation, page, { docuSignHandeler: callbackFun, refLink: '', agreementPDFLoader: callbackFun });
  }, []);

  const { offeringsStore, agreementsStore, handleClosePreview, callbackFun } = props;
  const { offer } = offeringsStore;
  const { AGREEMENT_DETAILS_FORM, setCheckbox, isAgreementFormValid, agreementPage } = agreementsStore;
  const businessName = get(offer, 'keyTerms.shorthandBusinessName');
  const index = agreementPage;
  return (
    <Modal open closeIcon onClose={handleClosePreview} size="small" closeOnDimmerClick={false}>
      <Modal.Header className="center-align signup-header">
        <Header as="h3" className="mb-40">
          Let&#39;s confirm your investment.<br />You are investing
            <span className="positive-text"> XXXX.00</span> in {businessName}.
          {AGREEMENT_DETAILS_FORM.fields.page[index].title.value
          && (
          <Header.Subheader>
            {AGREEMENT_DETAILS_FORM.fields.page[index].title.value}
          </Header.Subheader>
          )}
        </Header>
      </Modal.Header>
      <Modal.Content className="signup-content">
        <Form>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={16}>
                <FormCheckbox
                  defaults
                  fielddata={AGREEMENT_DETAILS_FORM.fields.page[index].toc}
                  name="toc"
                  containerclassname={`ui list agreement-list very relaxed ${!isAgreementFormValid ? 'error' : ''}`}
                  changed={(e, res) => setCheckbox(e, res, 'page', index)}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <div className="mt-30">
            <Button primary content="Invest" disabled={!isAgreementFormValid} onClick={callbackFun} />
          </div>
        </Form>
      </Modal.Content>
    </Modal>
  );
}

export default inject('agreementsStore', 'offeringsStore')(withRouter(observer(InvestNowTocPreview)));
