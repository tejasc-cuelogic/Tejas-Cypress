import React from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { get, startsWith } from 'lodash';
import { Modal, Header, Button, Grid, Form, Message } from 'semantic-ui-react';
import { FormCheckbox } from '../../../../../../../theme/form';
import Helper from '../../../../../../../helper/utility';
import { InlineLoader } from '../../../../../../../theme/shared';
// import ChangeInvestmentLimit from '../../ChangeInvestmentLimit';

@inject('investmentStore', 'uiStore', 'portfolioStore', 'campaignStore', 'accreditationStore', 'agreementsStore')
@withRouter
@observer
export default class Agreement extends React.Component {
  state = {
    showDocuSign: false,
    open: false,
    showError: false,
    showAgreementPdf: false,
  }
  componentWillMount() {
    const {
      stepToBeRendered, setStepToBeRendered, investAccTypes, resetAggrementForm, setFieldValue,
    } = this.props.investmentStore;
    const {
      getLegalDocsFileIds, alreadySet,
    } = this.props.agreementsStore;
    if (!alreadySet) {
      getLegalDocsFileIds().then(() => {
        // getBoxEmbedLink(doc.to, doc.id);
        console.log('successfully doc get');
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
      this.props.history.push(`${this.props.refLink}/overview`);
    }
  }
  submit = () => {
    if (this.props.investmentStore.AGREEMENT_DETAILS_FORM.meta.isValid) {
      this.props.investmentStore.finishInvestment().then((investmentStatus) => {
        if (investmentStatus) {
          console.log(this.props);
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
    // const { agreementDetails } = this.props.investmentStore;
    // const { cancelAgreement } = this.props.portfolioStore;
    // cancelAgreement(agreementDetails.agreementId);
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
    const { uiStore, match } = this.props;
    const { inProgress } = uiStore;
    const { getInvestorAccountById } = this.props.portfolioStore;
    const { campaign } = this.props.campaignStore;
    const { embedUrl, docLoading } = this.props.agreementsStore;
    const offeringRegulationType = get(campaign, 'keyTerms.regulation');
    const { currentInvestmentStatus } = this.props.accreditationStore;
    return (
      <Aux>
        <Modal open={this.state.open} closeOnDimmerClick={false} size="mini">
          <Modal.Content className="center-align">
            <Header as="h3">Confirm cancellation</Header>
            {this.props.changeInvestment ?
              <p className="mt-30 mb-30">{`By canceling this request, your prior investment of ${Helper.CurrencyFormat(investmentAmount)} in this offering will remain in place.`}</p>
              :
              <p className="mt-30 mb-30">By canceling this reservation, you will not be invested in this offering.</p>
            }
            <div className="center-align">
              <Button.Group widths="2" className="inline">
                <Button primary content="Back" onClick={this.handleCancel} />
                <Button color="gray" content="Confirm" onClick={this.handleConfirm} />
              </Button.Group>
            </div>
          </Modal.Content>
        </Modal>
        <Modal size="large" className="confirm-investment" open closeIcon closeOnRootNodeClick={false} closeOnDimmerClick={false} onClose={e => this.handleCloseModal(e)}>
          <Modal.Content className="signup-content">
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
                {(docLoading || !embedUrl) ? <InlineLoader /> :
                <iframe
                  width="100%"
                  height="100%"
                  title="agreement"
                  src={embedUrl}
                  ref={(c) => { this.iframeComponent = c; }}
                />
                }
              </div>
              <div className="center-align mt-20">
                <Button type="button" content="Go Back" primary onClick={e => this.agreementPDFLoader(e, false)} />
              </div>
            </div>
            <div style={{ display: this.state.showDocuSign || this.state.showAgreementPdf ? 'none' : 'block' }}>
              <Header as="h3" className="mb-40">
                Let&#39;s confirm your investment.<br />You are investing
                <span className="positive-text"> {Helper.CurrencyFormat(investmentAmount, 0)}</span> in
                {` ${this.props.changeInvestment ? (getInvestorAccountById && getInvestorAccountById.offering.keyTerms &&
                  getInvestorAccountById.offering.keyTerms.shorthandBusinessName) : (campaign && campaign.keyTerms && campaign.keyTerms.shorthandBusinessName)}`}.
              </Header>
              <Form
                error={this.state.showError &&
                  !this.props.investmentStore.AGREEMENT_DETAILS_FORM.meta.isValid}
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
                          customLabel={(
                            <Aux>
                              I have reviewed and agree to the terms of the <Link onClick={e => this.docuSignHandeler(e, true)} to="/">Note Purchase Agreement</Link>.
                            </Aux>
                          )}
                          conditionalCustomLabel={(
                            startsWith(offeringRegulationType, 'BD_') ?
                              <Aux>
                                I have reviewed NextSeed’s <Link target="_blank" to="/app/resources/welcome-packet">educational materials</Link>, understand that
                                the entire amount of my investment may be lost,
                                and confirm that I am in a
                                financial condition to bear the loss.
                                I have read and agree to the terms of
                                the <Link onClick={e => this.agreementPDFLoader(e, true, 'cCAgreement', 'SERVICES')} to="/">CrowdPay Custodial Account Agreement</Link>,
                                the <Link onClick={e => this.agreementPDFLoader(e, true, 'irsCertification', 'SERVICES')} to="/">Substitute IRS Form W-9 Certification</Link>,
                                and <Link onClick={e => this.agreementPDFLoader(e, true, 'bDIAgreemnt', 'SERVICES')} to="/">NextSeed Securities LLC Investor Agreement</Link>
                              </Aux>
                              :
                              <Aux>
                                <Aux>
                                  I have reviewed NextSeed’s <Link target="_blank" to="/app/resources/welcome-packet">educational materials</Link>, understand that
                                  the entire amount of my investment may be lost,
                                  and confirm that I am in a
                                  financial condition to bear the loss.
                                  I have read and agree to the terms of
                                  the <Link onClick={e => this.agreementPDFLoader(e, true, 'cCAgreement', 'SERVICES')} to="/">CrowdPay Custodial Account Agreement</Link>,
                                the <Link onClick={e => this.agreementPDFLoader(e, true, 'irsCertification', 'SERVICES')} to="/">Substitute IRS Form W-9 Certification</Link>,
                                  and <Link onClick={e => this.agreementPDFLoader(e, true, 'fPAgreemnt', 'SERVICES')} to="/">NextSeed US LLC Membership Agreement</Link>
                                </Aux>
                              </Aux>
                          )}
                          customUpdateLimitLabel={(
                            currentInvestmentStatus && currentInvestmentStatus === 'D506C' ?
                              <Aux>
                                I hereby certify that I have a reasonable expectation that I will
                                 continue to meet or exceed the requirements to be considered an
                                  accredited investor.
                              </Aux>
                              :
                              <Aux>
                                I confirm that I am complying with my <b>annual investment limit</b> (<Link to={`${match.url}/change-investment-limit`}>update</Link>)
                              </Aux>
                          )}
                          conditonalTooltip={!(currentInvestmentStatus && currentInvestmentStatus === 'D506C')}
                        />
                      </Grid.Column>
                    ))}
                  </Grid.Row>
                </Grid>
                {investmentFlowErrorMessage &&
                  <Message error className="mt-30">
                    {investmentFlowErrorMessage}
                  </Message>
                }
                <div className="center-align mt-30">
                  <Button type="button" color="gray" content="Cancel" onClick={this.handleCancelAgreement} />
                  <Button primary content="Invest" loading={inProgress} onClick={this.submit} />
                </div>
                {this.state.showError &&
                  !this.props.investmentStore.AGREEMENT_DETAILS_FORM.meta.isValid &&
                  <Message error className="bottom-error">All boxes must be checked to confirm your investment.</Message>
                }
              </Form>
            </div>
          </Modal.Content>
        </Modal>
      </Aux>
    );
  }
}
