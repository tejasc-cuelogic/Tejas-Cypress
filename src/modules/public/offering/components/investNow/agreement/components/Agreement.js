import React from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { withRouter, Link } from 'react-router-dom';
import { Modal, Header, Button, Grid, Form, Divider, Message } from 'semantic-ui-react';
import { FormCheckbox } from '../../../../../../../theme/form';
import Helper from '../../../../../../../helper/utility';

@withRouter
@inject('investmentStore')
@observer
export default class Agreement extends React.Component {
  state = {
    showDocuSign: false,
  }
  componentWillMount() {
    const { stepToBeRendered, setStepToBeRendered, investAccTypes } = this.props.investmentStore;
    if (investAccTypes.value === '') {
      this.props.history.push('invest-now');
    } else if (stepToBeRendered === 2) {
      setStepToBeRendered(0);
    }
  }
  handleCloseModal = () => {
    this.props.history.push('overview');
  }
  submit = () => {
    this.props.investmentStore.finishInvestment().then((investmentStatus) => {
      if (investmentStatus) {
        this.props.history.push('congratulation');
      }
    });
  }
  handleCancelAgreement = () => {
    this.props.history.push('confirm-cancellation');
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
    return (
      <Modal size="large" open closeIcon closeOnRootNodeClick={false} onClose={() => this.handleCloseModal()}>
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
            <span className="positive-text"> {Helper.CurrencyFormat(investmentAmount)}</span> in Pour Behavior.
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
            <Button primary disabled={!AGREEMENT_DETAILS_FORM.meta.isValid} onClick={this.submit}>
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
