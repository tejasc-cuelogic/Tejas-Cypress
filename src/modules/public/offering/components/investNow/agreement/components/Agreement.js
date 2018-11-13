import React from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter, Route, Link } from 'react-router-dom';
import { Modal, Header, Button, Grid, Form, Divider, Message } from 'semantic-ui-react';
import { FormCheckbox } from '../../../../../../../theme/form';
import Helper from '../../../../../../../helper/utility';
import ConfirmCancellation from '../../ConfirmCancellation';

@inject('investmentStore', 'uiStore', 'portfolioStore', 'campaignStore')
@withRouter
@observer
export default class Agreement extends React.Component {
  state = {
    showDocuSign: false,
  }
  componentWillMount() {
    const {
      stepToBeRendered, setStepToBeRendered, investAccTypes, resetAggrementForm,
    } = this.props.investmentStore;
    resetAggrementForm();
    if (investAccTypes.value === '') {
      this.props.history.push(`${this.props.refLink}/invest-now`);
    } else if (stepToBeRendered === 2) {
      setStepToBeRendered(0);
    }
  }
  handleCloseModal = () => {
    if (this.props.changeInvestment) {
      const { offeringId } = this.props.match.params;
      this.props.history.push(`${this.props.refLink}/${offeringId}`);
    } else {
      this.props.history.push(`${this.props.refLink}/overview`);
    }
  }
  submit = () => {
    this.props.investmentStore.finishInvestment().then((investmentStatus) => {
      if (investmentStatus) {
        this.props.history.push('congratulation');
      }
    });
  }
  handleCancelAgreement = (e) => {
    e.preventDefault();
    const { match } = this.props;
    this.props.history.push(`${match.url}/confirm-cancellation`);
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
    } = this.props.investmentStore;
    const { match, uiStore } = this.props;
    const { inProgress } = uiStore;
    const { getInvestorAccountById } = this.props.portfolioStore;
    const { campaign } = this.props.campaignStore;
    return (
      <Modal size="large" open closeIcon closeOnRootNodeClick={false} onClose={() => this.handleCloseModal()}>
        <Route exact path={`${match.url}/confirm-cancellation`} render={() => <ConfirmCancellation refLink={this.props.refLink} />} />
        <Modal.Content className="signup-header" style={{ display: this.state.showDocuSign ? 'block' : 'none' }}>
          <div className="pdf-viewer">
            <iframe onLoad={this.iframeLoading} width="100%" height="100%" title="agreement" src={agreementDetails && agreementDetails.docuSignViewURL} />
          </div>
          <div className="center-align mt-20">
            <Button type="button" primary onClick={e => this.docuSignHandeler(e, false)}>
            Go Back
            </Button>
          </div>
        </Modal.Content>
        <Modal.Content className="signup-header" style={{ display: this.state.showDocuSign ? 'none' : 'block' }}>
          <Header as="h3" className="mb-40">
            Let&#39;s confirm your investment.<br />You are investing
            <span className="positive-text"> {Helper.CurrencyFormat(investmentAmount)}</span> in
            {` ${this.props.changeInvestment ? (getInvestorAccountById && getInvestorAccountById.offering.keyTerms &&
                    getInvestorAccountById.offering.keyTerms.shorthandBusinessName) : (campaign && campaign.keyTerms && campaign.keyTerms.shorthandBusinessName)}`}.
          </Header>
          {!AGREEMENT_DETAILS_FORM.meta.isValid &&
            <Message error textAlign="left" className="mb-40">
              All boxes must be checked to confirm your investment.
            </Message>
          }
          <Form error size="huge">
            <Grid stackable>
              <Grid.Row>
                {['checkboxesLeft', 'checkboxesRight'].map(field => (
                  <Grid.Column width={8}>
                    <FormCheckbox
                      defaults
                      fielddata={AGREEMENT_DETAILS_FORM.fields[field]}
                      name={field}
                      containerclassname="ui very relaxed list"
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
          <Divider hidden />
          <div className="center-align">
            <Button
              primary
              loading={inProgress}
              disabled={!AGREEMENT_DETAILS_FORM.meta.isValid}
              onClick={this.submit}
            >
            Invest
            </Button>
            <Button type="button" color="gray" onClick={this.handleCancelAgreement}>
            Cancel
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}
