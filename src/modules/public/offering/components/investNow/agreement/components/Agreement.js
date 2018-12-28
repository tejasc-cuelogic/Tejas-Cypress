import React from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Modal, Header, Button, Grid, Form, Message } from 'semantic-ui-react';
import { FormCheckbox } from '../../../../../../../theme/form';
import Helper from '../../../../../../../helper/utility';

@inject('investmentStore', 'uiStore', 'portfolioStore', 'campaignStore')
@withRouter
@observer
export default class Agreement extends React.Component {
  state = {
    showDocuSign: false,
    open: false,
    showError: false,
  }
  componentWillMount() {
    const {
      stepToBeRendered, setStepToBeRendered, investAccTypes, resetAggrementForm, setFieldValue,
    } = this.props.investmentStore;
    resetAggrementForm();
    if (investAccTypes.value === '') {
      this.props.history.push(`${this.props.refLink}/invest-now`);
    } else if (stepToBeRendered === 2) {
      setStepToBeRendered(0);
    }
    setFieldValue('investmentFlowErrorMessage', null);
  }
  handleCloseModal = (e) => {
    this.props.investmentStore.resetData();
    if (this.state.showDocuSign) {
      this.docuSignHandeler(e, false);
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
  handleCancel = () => {
    this.props.history.push('agreement');
    this.setState({ open: false });
  }
  handleConfirm = () => {
    const { agreementDetails } = this.props.investmentStore;
    const { cancelAgreement } = this.props.portfolioStore;
    cancelAgreement(agreementDetails.agreementId);
    this.props.history.push(`${this.props.refLink}/invest-now`);
    this.setState({ open: false });
  }
  docuSignHandeler = (event, state) => {
    event.preventDefault();
    this.setState({ showDocuSign: state });
  }
  render() {
    const {
      AGREEMENT_DETAILS_FORM,
      investmentAmount,
      setCheckbox,
      agreementDetails,
      investmentFlowErrorMessage,
    } = this.props.investmentStore;
    const { uiStore } = this.props;
    const { inProgress } = uiStore;
    const { getInvestorAccountById } = this.props.portfolioStore;
    const { campaign } = this.props.campaignStore;
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
        <Modal size="large" open closeIcon closeOnRootNodeClick={false} onClose={e => this.handleCloseModal(e)}>
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
            <div style={{ display: this.state.showDocuSign ? 'none' : 'block' }}>
              <Header as="h3" className="mb-40">
                Let&#39;s confirm your investment.<br />You are investing
                <span className="positive-text"> {Helper.CurrencyFormat(investmentAmount)}</span> in
                {` ${this.props.changeInvestment ? (getInvestorAccountById && getInvestorAccountById.offering.keyTerms &&
                  getInvestorAccountById.offering.keyTerms.shorthandBusinessName) : (campaign && campaign.keyTerms && campaign.keyTerms.shorthandBusinessName)}`}.
              </Header>
              <Form error>
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
                        />
                      </Grid.Column>
                    ))}
                  </Grid.Row>
                </Grid>
              </Form>
              {investmentFlowErrorMessage &&
                <Message error className="mt-30">
                  {investmentFlowErrorMessage}
                </Message>
              }
              <div className="center-align mt-30">
                <Button primary content="Invest" loading={inProgress} onClick={this.submit} />
                <Button type="button" color="gray" content="Cancel" onClick={this.handleCancelAgreement} />
              </div>
              {this.state.showError &&
              !this.props.investmentStore.AGREEMENT_DETAILS_FORM.meta.isValid &&
                <Message error className="bottom-error">All boxes must be checked to confirm your investment.</Message>
              }
            </div>
          </Modal.Content>
        </Modal>
      </Aux>
    );
  }
}
