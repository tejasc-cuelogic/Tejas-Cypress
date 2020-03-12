import React, { useEffect, useState, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { Header, Button, Grid } from 'semantic-ui-react';
import Helper from '../../../helper/utility';
import { InlineLoader, NsModal } from '../../../theme/shared';
import CustomAgreement from '../../public/offering/components/investNow/agreement/agreementTemplates/customAgreement';
import DynamicAgreement from '../../public/offering/components/investNow/agreement/agreementTemplates/dynamicAgreement';

const isMobile = document.documentElement.clientWidth < 768;
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
        // console.log('successfully doc get.');
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

  const submit = (currentAction = undefined) => {
    const isFormValid = currentAction && currentAction === 'CUSTOM' ? props.investmentStore.AGREEMENT_DETAILS_FORM.meta.isValid : props.agreementsStore.isAgreementFormValid;
    if (isFormValid) {
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

  const handleCancelAgreement = () => {
    // e.preventDefault();
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

  const handleBack = (e) => {
    e.preventDefault();
    setShowDocuSign(false);
    setShowAgreementPdf(false);
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
  const agreementStatement = campaignStatus.isPreferredEquity ? 'Purchase Agreement and Investor Proxy Agreement' : campaignStatus.isRealEstate ? 'LLC Agreement and Subscription Agreement' : campaignStatus.isSafe ? 'SAFE' : 'Note Purchase Agreement';
  const offeringRegulationType = get(campaign, 'keyTerms.regulation');
  const index = agreementPage;
  return (
    <>
      <NsModal
        open={open}
        closeOnDimmerClick={false}
        headerLogo
        borderedHeader
        isProgressHeaderDisable
      >
        <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
          <Grid.Column width="8" className="pt-0">
            <Header as="h3">Confirm cancellation</Header>
            {props.changeInvestment
              ? <p className="mt-30 mb-30">{`By canceling this request, your prior investment of ${Helper.CurrencyFormat(previouslyInvestedAmount)} in this offering will remain in place.`}</p>
              : <p className="mt-30 mb-30">By canceling this reservation, you will not be invested in this offering.</p>
            }
            <Button.Group widths="2" className="inline">
              <Button primary content="Back" onClick={handleCancel} />
              <Button color="gray" content="Confirm" onClick={handleConfirm} />
            </Button.Group>
          </Grid.Column>
        </Grid>
      </NsModal>
      <NsModal
        open
        closeOnRootNodeClick={false}
        closeOnDimmerClick={false}
        onClose={handleCancelAgreement}
        headerLogo
        borderedHeader
        isProgressHeaderDisable
        isHeaderDisabled={showAgreementPdf}
        modalContentClass={showAgreementPdf ? 'pt-0 pb-0' : ''}
        disableCloseIcon={showDocuSign || showAgreementPdf}
      >
        {(showDocuSign || showAgreementPdf)
          && (
            <Button
              icon={{ className: 'ns-chevron-left' }}
              className={`${showAgreementPdf ? 'mt-50' : ''} multistep__btn prev prev link-button`}
              onClick={e => handleBack(e)}
              content="Back"
            />
          )}
        <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
          <Grid.Column width="10" className="pt-0">
            <div style={{ display: showDocuSign ? 'block' : 'none' }}>
              <div className="pdf-viewer">
                <iframe onLoad={props.iframeLoading} width="0" height="0" title="agreement" src={agreementDetails && agreementDetails.docuSignViewURL} />
                <iframe onLoad={props.iframeLoading} width="100%" height="100%" title="npa" src={agreementDetails && agreementDetails.npaViewUrl} />
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
              {
                campaignStatus.isAgreementTemplate
                  ? (
                    <DynamicAgreement
                      inProgress={inProgress}
                      showError={showError}
                      docuSignHandeler={docuSignHandeler}
                      agreementPDFLoader={agreementPDFLoader}
                      submit={submit}
                      setCheckbox={setCheckbox}
                      isAgreementFormValid={isAgreementFormValid}
                      investmentFlowErrorMessage={investmentFlowErrorMessage}
                      index={index}
                      {...props}
                    />
                  )
                  : (
                    <CustomAgreement
                      inProgress={inProgress}
                      showError={showError}
                      docuSignHandeler={docuSignHandeler}
                      agreementPDFLoader={agreementPDFLoader}
                      submit={submit}
                      agreementStatement={agreementStatement}
                      offeringRegulationType={offeringRegulationType}
                      {...props}
                    />
                  )
              }
            </div>
          </Grid.Column>
        </Grid>
      </NsModal>
    </>
  );
}

export default inject('investmentStore', 'uiStore', 'portfolioStore', 'campaignStore', 'accreditationStore', 'agreementsStore', 'investmentLimitStore')(withRouter(observer(AgreementTemplate)));
