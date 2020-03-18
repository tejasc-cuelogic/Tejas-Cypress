import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { Header, Button, Grid, Form } from 'semantic-ui-react';
import { FormCheckbox } from '../../../../../../../theme/form';
import { NsModal } from '../../../../../../../theme/shared';

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
    <NsModal
      useMountNode
      open
      closeOnRootNodeClick={false}
      closeOnDimmerClick={false}
      onClose={handleClosePreview}
      headerLogo
      borderedHeader
    >
      <Grid centered stackable className="mt-0">
        <Grid.Column width="10" className="pt-0">
          <div style={{ display: 'block' }}>
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
            <Form>
              <Grid stackable>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <FormCheckbox
                      defaults
                      fielddata={AGREEMENT_DETAILS_FORM.fields.page[index].toc}
                      name="toc"
                      containerclassname="ui list agreement-list very relaxed"
                      changed={(e, res) => setCheckbox(e, res, 'page', index)}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <div className="mt-30">
                <Button primary content="Invest" disabled={!isAgreementFormValid} onClick={callbackFun} />
              </div>
            </Form>
          </div>
        </Grid.Column>
      </Grid>
    </NsModal>
  );
}

export default inject('agreementsStore', 'offeringsStore')(withRouter(observer(InvestNowTocPreview)));
