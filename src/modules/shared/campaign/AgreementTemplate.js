import React, { useEffect, useState, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { Modal, Header, Button, Grid, Form, Message } from 'semantic-ui-react';
import { FormCheckbox } from '../../../theme/form';
import Helper from '../../../helper/utility';
import { InlineLoader } from '../../../theme/shared';

function AgreementTemplate(props) {
  const [showDocuSign, setShowDocuSign] = useState(false);
  const [open, setOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showAgreementPdf, setShowAgreementPdf] = useState(false);
  const iframeComponent = useRef(null);

  const docuSignHandeler = (event, state) => {
    event.preventDefault();
    setShowDocuSign(state);
  };

  const agreementPDFLoader = (event, state, agreementKey, agreementType) => {
    event.preventDefault();
    if (state === true) {
      const { getNavItems, getBoxEmbedLink } = props.agreementsStore;
      const doc = getNavItems.find(ele => ele.to.toString() === agreementKey);
      getBoxEmbedLink(doc.to, doc.id, agreementType);
    }
    setShowAgreementPdf(state);
  };

  useEffect(() => {
    // Constructor Code:
    const { campaignStore, portfolioStore, investmentStore, agreementsStore, investmentLimitStore } = props;
    props.campaignStore.setFieldValue('inInvestmentFlow', true);
    const offeringIdToUpdate = campaignStore.getOfferingId
      ? campaignStore.getOfferingId : portfolioStore.currentOfferingId;
    if (!offeringIdToUpdate || offeringIdToUpdate === '') {
      props.history.push(`${props.refLink}`);
    }
    // Component DidMount Code:
    const {
      stepToBeRendered, setStepToBeRendered, investAccTypes, resetAggrementForm, setFieldValue,
    } = investmentStore;
    const {
      getLegalDocsFileIds, alreadySet, createAgreementTocs,
    } = agreementsStore;
    if (!alreadySet) {
      getLegalDocsFileIds().then(() => {
        // console.log('successfully doc get');
      });
    }
    resetAggrementForm();
    if (investAccTypes.value === '') {
      props.history.push(`${props.refLink}/invest-now`);
    } else if (stepToBeRendered === 2) {
      setStepToBeRendered(0);
    }
    setFieldValue('investmentFlowErrorMessage', null);
    const { currentInvestmentStatus } = props.accreditationStore;
    createAgreementTocs(currentInvestmentStatus, { docuSignHandeler, refLink: props.match.url, agreementPDFLoader });
    // Component WillUnMount Code:
    return () => {
      campaignStore.setFieldValue('inInvestmentFlow', false);
      const redirectURL = props.history.location.pathname;
      if (!redirectURL.includes('change-investment-limit') && !redirectURL.includes('agreement')) {
        investmentLimitStore.setFieldValue('investNowHealthCheckDetails', {});
      }
    };
  }, []);

  const handleCloseModal = (e) => {
    if (!showDocuSign && !showAgreementPdf) {
      props.investmentStore.resetData();
      props.accreditationStore.resetUserAccreditatedStatus();
    }
    if (showDocuSign) {
      docuSignHandeler(e, false);
    } else if (showAgreementPdf) {
      agreementPDFLoader(e, false);
    } else if (props.changeInvestment) {
      const { offeringId } = props.match.params;
      props.history.push(`${props.refLink}/${offeringId}`);
    } else {
      props.history.push(`${props.refLink}`);
    }
  };

  const submit = () => {
    if (props.agreementsStore.isAgreementFormValid) {
      setShowError(false);
      props.investmentStore.setFieldValue('investmentFlowErrorMessage', null);
      props.investmentStore.investNowSubmit().then((investmentStatus) => {
        if (investmentStatus) {
          props.history.push('congratulation');
        }
      });
    } else {
      setShowError(true);
    }
  };

  const handleCancelAgreement = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    props.history.push('agreement');
    setOpen(false);
  };

  const handleConfirm = () => {
    props.investmentStore.resetData();
    props.accreditationStore.resetUserAccreditatedStatus();
    props.history.push(`${props.refLink}/invest-now`);
    setOpen(false);
  };

  const {
    investmentAmount,
    agreementDetails,
    investmentFlowErrorMessage,
  } = props.investmentStore;
  const { AGREEMENT_DETAILS_FORM, setCheckbox, isAgreementFormValid, embedUrl, docLoading, agreementPage } = props.agreementsStore;
  const { getCurrentInvestNowHealthCheck } = props.investmentLimitStore;
  const previouslyInvestedAmount = get(getCurrentInvestNowHealthCheck, 'previousAmountInvested') ? get(getCurrentInvestNowHealthCheck, 'previousAmountInvested') : '0';
  const { uiStore } = props; // match
  const { inProgress } = uiStore;
  const { getInvestorAccountById } = props.portfolioStore;
  const { campaign, campaignStatus } = props.campaignStore;
  const offeringDetailsObj = campaign || get(getInvestorAccountById, 'offering');
  const businessName = get(offeringDetailsObj, 'keyTerms.shorthandBusinessName');
  const index = agreementPage;
  return (
    <>
      <Modal open={open} closeOnDimmerClick={false} size="mini">
        <Modal.Content className="center-align">
          <Header as="h3">Confirm cancellation</Header>
          {props.changeInvestment
            ? <p className="mt-30 mb-30">{`By canceling this request, your prior investment of ${Helper.CurrencyFormat(previouslyInvestedAmount)} in this offering will remain in place.`}</p>
            : <p className="mt-30 mb-30">By canceling this reservation, you will not be invested in this offering.</p>
          }
          <div className="center-align">
            <Button.Group widths="2" className="inline">
              <Button primary content="Back" onClick={handleCancel} />
              <Button color="gray" content="Confirm" onClick={handleConfirm} />
            </Button.Group>
          </div>
        </Modal.Content>
      </Modal>
      <Modal size="large" className="confirm-investment" open closeIcon={!agreementDetails} closeOnRootNodeClick={false} closeOnDimmerClick={false} onClose={e => handleCloseModal(e)}>
        <Modal.Content className="signup-content">
          <div style={{ display: showDocuSign ? 'block' : 'none' }}>
            <div className="pdf-viewer">
              <iframe onLoad={props.iframeLoading} width="0" height="0" title="agreement" src={agreementDetails && agreementDetails.docuSignViewURL} />
              <iframe onLoad={props.iframeLoading} width="100%" height="100%" title="npa" src={agreementDetails && agreementDetails.npaViewUrl} />
            </div>
            <div className="center-align mt-20">
              <Button type="button" content="Go Back" primary onClick={e => docuSignHandeler(e, false)} />
            </div>
          </div>
          <div style={{ display: showAgreementPdf ? 'block' : 'none' }}>
            <div className="pdf-viewer">
              {(docLoading || !embedUrl) ? <InlineLoader />
                : (
                  <iframe
                    width="100%"
                    height="100%"
                    title="agreement"
                    src={embedUrl}
                    ref={iframeComponent}
                  />
                )
              }
            </div>
            <div className="center-align mt-20">
              <Button type="button" content="Go Back" primary onClick={e => agreementPDFLoader(e, false)} />
            </div>
          </div>
          <div style={{ display: showDocuSign || showAgreementPdf ? 'none' : 'block' }}>
            <Header as="h3" className="mb-40">
              Let&#39;s confirm your investment.<br />You are investing
                <span className="positive-text"> {campaignStatus.isPreferredEquity ? Helper.CurrencyFormat(investmentAmount) : Helper.CurrencyFormat(investmentAmount, 0)}</span> in {businessName}.
              {AGREEMENT_DETAILS_FORM.fields.page[index].title.value
              && (
              <Header.Subheader>
                {AGREEMENT_DETAILS_FORM.fields.page[index].title.value}
              </Header.Subheader>
              )}
            </Header>
            <Form
              error={(showError
                && !isAgreementFormValid)
                || investmentFlowErrorMessage}
            >
              <Grid stackable>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <FormCheckbox
                      defaults
                      fielddata={AGREEMENT_DETAILS_FORM.fields.page[index].toc}
                      name="toc"
                      containerclassname={`ui list agreement-list very relaxed ${showError && !isAgreementFormValid ? 'error' : ''}`}
                      changed={(e, res) => setCheckbox(e, res, 'page', index)}
                      disabled={inProgress}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <div className="center-align mt-30">
                <Button.Group widths="2" className="inline">
                  <Button type="button" color="gray" disabled={inProgress} content="Cancel" onClick={handleCancelAgreement} />
                  <Button primary content="Invest" disabled={inProgress || !isAgreementFormValid} loading={inProgress} onClick={submit} />
                </Button.Group>
              </div>
              {!showError && investmentFlowErrorMessage
                && (
                  <Message error className="mt-30 bottom-error">
                    {investmentFlowErrorMessage}
                  </Message>
                )
              }
              {showError
                && !isAgreementFormValid
                && <Message error className="bottom-error">All boxes must be checked to confirm your investment.</Message>
              }
            </Form>
          </div>
        </Modal.Content>
      </Modal>
    </>
  );
}

export default inject('investmentStore', 'uiStore', 'portfolioStore', 'campaignStore', 'accreditationStore', 'agreementsStore', 'investmentLimitStore')(withRouter(observer(AgreementTemplate)));
