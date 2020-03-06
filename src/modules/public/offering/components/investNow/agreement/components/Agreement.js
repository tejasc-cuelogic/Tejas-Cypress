import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { get, startsWith, includes } from 'lodash';
import { Header, Button, Grid, Form, Message } from 'semantic-ui-react';
import { FormCheckbox } from '../../../../../../../theme/form';
import Helper from '../../../../../../../helper/utility';
import { InlineLoader, NsModal } from '../../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;
@inject('investmentStore', 'uiStore', 'portfolioStore', 'campaignStore', 'accreditationStore', 'agreementsStore', 'investmentLimitStore')
@withRouter
@observer
export default class Agreement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDocuSign: false,
      open: false,
      showError: false,
      showAgreementPdf: false,
    };
    const { campaignStore, portfolioStore } = this.props;
    this.props.campaignStore.setFieldValue('inInvestmentFlow', true);
    const offeringIdToUpdate = campaignStore.getOfferingId
      ? campaignStore.getOfferingId : portfolioStore.currentOfferingId;
      if (!offeringIdToUpdate || offeringIdToUpdate === '') {
        this.props.history.push(`${this.props.refLink}`);
      }
  }

  componentDidMount() {
    const {
      stepToBeRendered, setStepToBeRendered, investAccTypes, resetAggrementForm, setFieldValue,
    } = this.props.investmentStore;
    const {
      getLegalDocsFileIds, alreadySet,
    } = this.props.agreementsStore;
    if (!alreadySet) {
      getLegalDocsFileIds().then(() => {
        // getBoxEmbedLink(doc.to, doc.id);
        // console.log('successfully doc get');
      });
    }
    resetAggrementForm();
    if (investAccTypes.value === '') {
      this.props.history.push(`${this.props.refLink}/invest-now`);
    } else if (stepToBeRendered === 2) {
      setStepToBeRendered(0);
    }
    setFieldValue('investmentFlowErrorMessage', null);
  }

  componentWillUnmount() {
    this.props.campaignStore.setFieldValue('inInvestmentFlow', false);
    const redirectURL = this.props.history.location.pathname;
    if (!redirectURL.includes('change-investment-limit') && !redirectURL.includes('agreement')) {
      this.props.investmentLimitStore.setFieldValue('investNowHealthCheckDetails', {});
    }
  }

  handleCloseModal = (e) => {
    if (!this.state.showDocuSign && !this.state.showAgreementPdf) {
      this.props.investmentStore.resetData();
      this.props.accreditationStore.resetUserAccreditatedStatus();
    }
    if (this.state.showDocuSign) {
      this.docuSignHandeler(e, false);
    } else if (this.state.showAgreementPdf) {
      this.agreementPDFLoader(e, false);
    } else if (this.props.changeInvestment) {
      const { offeringId } = this.props.match.params;
      this.props.history.push(`${this.props.refLink}/${offeringId}`);
    } else {
      this.props.history.push(`${this.props.refLink}`);
    }
  }

  submit = () => {
    if (this.props.investmentStore.AGREEMENT_DETAILS_FORM.meta.isValid) {
      this.setState({ showError: false });
      this.props.investmentStore.setFieldValue('investmentFlowErrorMessage', null);
      this.props.investmentStore.investNowSubmit().then((investmentStatus) => {
        if (investmentStatus) {
          this.props.history.push('congratulation');
        }
      });
    } else {
      this.setState({ showError: true });
    }
  }

  handleCancelAgreement = (e) => {
    e.preventDefault();
    this.setState({ open: true });
  }

  handleCancel = (e) => {
    e.preventDefault();
    this.props.history.push('agreement');
    this.setState({ open: false });
  }

  handleConfirm = () => {
    this.props.investmentStore.resetData();
    this.props.accreditationStore.resetUserAccreditatedStatus();
    this.props.history.push(`${this.props.refLink}/invest-now`);
    this.setState({ open: false });
  }

  docuSignHandeler = (event, state) => {
    event.preventDefault();
    this.setState({ showDocuSign: state });
  }

  agreementPDFLoader = (event, state, agreementKey, agreementType) => {
    event.preventDefault();
    if (state === true) {
      const { getNavItems, getBoxEmbedLink } = this.props.agreementsStore;
      const doc = getNavItems.find(ele => ele.to.toString() === agreementKey);
      getBoxEmbedLink(doc.to, doc.id, agreementType);
    }
    this.setState({ showAgreementPdf: state });
  }

  render() {
    const {
      AGREEMENT_DETAILS_FORM,
      investmentAmount,
      setCheckbox,
      agreementDetails,
      investmentFlowErrorMessage,
    } = this.props.investmentStore;
    const { getCurrentInvestNowHealthCheck } = this.props.investmentLimitStore;
    const previouslyInvestedAmount = get(getCurrentInvestNowHealthCheck, 'previousAmountInvested') ? get(getCurrentInvestNowHealthCheck, 'previousAmountInvested') : '0';
    const { uiStore, match } = this.props;
    const { inProgress } = uiStore;
    const { getInvestorAccountById } = this.props.portfolioStore;
    const { campaign, campaignStatus } = this.props.campaignStore;
    const { embedUrl, docLoading } = this.props.agreementsStore;
    const offeringRegulationType = get(campaign, 'keyTerms.regulation');
    const { currentInvestmentStatus } = this.props.accreditationStore;
    const investmentRegulation = get(getInvestorAccountById, 'regulation');
    const regulationCheck = currentInvestmentStatus || investmentRegulation;
    const regualtionTypeStatement = regulationCheck && regulationCheck === 'BD_506C' ? 'Regulation D 506C' : regulationCheck === 'BD_506B' ? 'Rule 506(b) of Regulation D' : 'Regulation Crowdfunding';
    const offeringDetailsObj = campaign || get(getInvestorAccountById, 'offering');
    const businessName = get(offeringDetailsObj, 'keyTerms.shorthandBusinessName');
    const agreementStatement = campaignStatus.isPreferredEquity ? 'Purchase Agreement and Investor Proxy Agreement' : campaignStatus.isRealEstate ? 'LLC Agreement and Subscription Agreement' : campaignStatus.isSafe ? 'SAFE' : 'Note Purchase Agreement';
    return (
      <>
        <NsModal
          open={this.state.open}
          closeOnDimmerClick={false}
          headerLogo
          borderedHeader
          isProgressHeaderDisable
        >
          <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
            <Grid.Column width="8" className="pt-0">
              <Header as="h3">Confirm cancellation</Header>
              {this.props.changeInvestment
                ? <p className="mt-30 mb-30">{`By canceling this request, your prior investment of ${Helper.CurrencyFormat(previouslyInvestedAmount)} in this offering will remain in place.`}</p>
                : <p className="mt-30 mb-30">By canceling this reservation, you will not be invested in this offering.</p>
              }
              <Button.Group widths="2" className="inline">
                <Button primary content="Back" onClick={this.handleCancel} />
                <Button color="gray" content="Confirm" onClick={this.handleConfirm} />
              </Button.Group>
           </Grid.Column>
          </Grid>
        </NsModal>
        <NsModal
          open
          closeIcon={!agreementDetails}
          closeOnRootNodeClick={false}
          closeOnDimmerClick={false}
          onClose={e => this.handleCloseModal(e)}
          headerLogo
          borderedHeader
          isProgressHeaderDisable
        >
          <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
            <Grid.Column width="14" className="pt-0">
              <div style={{ display: this.state.showDocuSign ? 'block' : 'none' }}>
                <div className="pdf-viewer">
                  <iframe onLoad={this.iframeLoading} width="0" height="0" title="agreement" src={agreementDetails && agreementDetails.docuSignViewURL} />
                  <iframe onLoad={this.iframeLoading} width="100%" height="100%" title="npa" src={agreementDetails && agreementDetails.npaViewUrl} />
                </div>
                <div className="center-align mt-20">
                  <Button type="button" content="Go Back" primary onClick={e => this.docuSignHandeler(e, false)} />
                </div>
              </div>
              <div style={{ display: this.state.showAgreementPdf ? 'block' : 'none' }}>
                <div className="pdf-viewer">
                  {(docLoading || !embedUrl) ? <InlineLoader />
                    : (
                      <iframe
                        width="100%"
                        height="100%"
                        title="agreement"
                        src={embedUrl}
                        ref={(c) => { this.iframeComponent = c; }}
                      />
                    )
                  }
                </div>
                <div className="center-align mt-20">
                  <Button type="button" content="Go Back" primary onClick={e => this.agreementPDFLoader(e, false)} />
                </div>
              </div>
              <div style={{ display: this.state.showDocuSign || this.state.showAgreementPdf ? 'none' : 'block' }}>
                <Header as="h3" className="mb-40">
                  Let&#39;s confirm your investment.<br />You are investing
                  <span className="positive-text"> {campaignStatus.isPreferredEquity ? Helper.CurrencyFormat(investmentAmount) : Helper.CurrencyFormat(investmentAmount, 0)}</span> in {businessName}.
                </Header>
                <Form
                  error={(this.state.showError
                    && !this.props.investmentStore.AGREEMENT_DETAILS_FORM.meta.isValid)
                    || investmentFlowErrorMessage}
                >
                  <Grid stackable>
                    <Grid.Row>
                      {['checkboxesLeft', 'checkboxesRight'].map(field => (
                        <Grid.Column width={8}>
                          <FormCheckbox
                            defaults
                            fielddata={AGREEMENT_DETAILS_FORM.fields[field]}
                            name={field}
                            containerclassname={`ui very relaxed list ${this.state.showError && !this.props.investmentStore.AGREEMENT_DETAILS_FORM.meta.isValid ? 'error' : ''}`}
                            changed={setCheckbox}
                            disabled={inProgress}
                            customLabel={(
                              <>
                                I have reviewed and agree to the terms of the <Link onClick={e => this.docuSignHandeler(e, true)} to="/">{agreementStatement}</Link>.
                              </>
                            )}
                            conditionalCustomLabel={(
                              startsWith(offeringRegulationType, 'BD_')
                                ? (
  <>
                                  I have reviewed NextSeed’s <Link target="_blank" to="/resources/education-center/investor">educational materials</Link>, understand that
                                  the entire amount of my investment may be lost,
                                  and confirm that I am in a
                                  financial condition to bear the loss.
                                  I have read and agree to the terms of
                                  the <Link onClick={e => this.agreementPDFLoader(e, true, 'cCAgreement', 'SERVICES')} to="/">CrowdPay Custodial Account Agreement</Link>,
                                  the <Link onClick={e => this.agreementPDFLoader(e, true, 'irsCertification', 'SERVICES')} to="/">Substitute IRS Form W-9 Certification</Link>,
                                  and <Link onClick={e => this.agreementPDFLoader(e, true, 'bDIAgreemnt', 'SERVICES')} to="/">NextSeed Securities LLC Investor Agreement</Link>
                                  </>
                                )
                                : (
                                  <>
                                    I have reviewed NextSeed’s <Link target="_blank" to="/resources/education-center/investor">educational materials</Link>, understand that
                                    the entire amount of my investment may be lost,
                                    and confirm that I am in a
                                    financial condition to bear the loss.
                                    I have read and agree to the terms of
                                    the <Link onClick={e => this.agreementPDFLoader(e, true, 'cCAgreement', 'SERVICES')} to="/">CrowdPay Custodial Account Agreement</Link>,
                                  the <Link onClick={e => this.agreementPDFLoader(e, true, 'irsCertification', 'SERVICES')} to="/">Substitute IRS Form W-9 Certification</Link>,
                                    and <Link onClick={e => this.agreementPDFLoader(e, true, 'fPAgreemnt', 'SERVICES')} to="/">NextSeed US LLC Membership Agreement</Link>
                                  </>
                                )
                            )}
                            customUpdateLimitLabel={(
                              regulationCheck && includes(['BD_506C', 'BD_506B'], regulationCheck)
                                ? (
                                  <>
                                    I hereby certify that I have a reasonable expectation that I will
                                    continue to meet or exceed the requirements to be considered an
                                      accredited investor.
                                </>
                                )
                                : (
                                  <>
                                    I confirm that I am complying with my <b>annual investment limit</b> {' '}
                                    {regulationCheck && !includes(['BD_506C', 'BD_506B'], regulationCheck) && (<Link to={`${match.url}/change-investment-limit`}>update</Link>)}
                                  </>
                                )
                            )}
                            customRegulationLabel={(
                              <>
                                I understand that investing in securities sold in reliance on {' '}
                                {regualtionTypeStatement} involves risks and I should not invest
                                  any funds unless I can afford to lose the entire amount.
                              </>
                            )}
                            tooltipHardDisable={(regulationCheck && includes(['BD_506C', 'BD_506B'], regulationCheck))}
                            currentInvestmentStatus={regulationCheck}
                          />
                        </Grid.Column>
                      ))}
                    </Grid.Row>
                  </Grid>
                  <div className="mt-30">
                    <Button.Group widths="2" className="inline">
                      <Button type="button" color="gray" disabled={inProgress} content="Cancel" onClick={this.handleCancelAgreement} />
                      <Button primary content="Invest" disabled={inProgress} loading={inProgress} onClick={this.submit} />
                    </Button.Group>
                  </div>
                  {!this.state.showError && investmentFlowErrorMessage
                    && (
                      <Message error className="mt-30 bottom-error">
                        {investmentFlowErrorMessage}
                      </Message>
                    )
                  }
                  {this.state.showError
                    && !this.props.investmentStore.AGREEMENT_DETAILS_FORM.meta.isValid
                    && <Message error className="bottom-error">All boxes must be checked to confirm your investment.</Message>
                  }
                </Form>
              </div>
            </Grid.Column>
          </Grid>
        </NsModal>
      </>
    );
  }
}
