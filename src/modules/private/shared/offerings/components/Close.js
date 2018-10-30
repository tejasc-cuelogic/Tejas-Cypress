import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Aux from 'react-aux';
import { Form, Header, Divider, Step, Label, Button, Icon, Confirm } from 'semantic-ui-react';
import Contingency from './overview/Contingency';
import { MaskedInput, FormCheckbox } from '../../../../../theme/form';

@inject('offeringCreationStore', 'offeringsStore')
@observer
export default class Close extends Component {
  state = {
    activeStep: 1,
    confirmContentTxt: 'Are all transactions cleared?  Has it been at least 6 business days since the last deposit for any investment?',
    cancelButtonTxt: 'No, it has not',
    confirmButtonTxt: 'Yes, it has',
    open: false,
  }
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('OFFERING_CLOSE_FRM', 'closureSummary');
  }
  submitStep = () => {
    const currentStep = this.state.activeStep;
    this.setState({ open: false, activeStep: currentStep + 1 });
  }
  showConfirmBox = () => {
    if (this.state.activeStep === 3) {
      this.setState({
        confirmContentTxt: 'Are you sure you want to Finalize and Close the envelopes?',
        cancelButtonTxt: 'No, go back',
        confirmButtonTxt: 'Yes, proceed',
      });
    }
    this.setState({ open: true });
  }
  handleCancel = () => {
    this.setState({ open: false });
  }
  handleCloseOffering = () => {
    console.log('closed');
  }
  render() {
    const {
      OFFERING_CLOSE_FRM,
      CLOSING_CONTITNGENCIES_FRM,
      maskChange,
      formArrayChange,
    } = this.props.offeringCreationStore;
    const formName = 'OFFERING_CLOSE_FRM';
    const { offer } = this.props.offeringsStore;
    const { stage } = offer;
    return (
      <Form>
        <div className="inner-content-spacer">
          <Header as="h4">
            {stage === 'LIVE' ?
              <Aux>This campaing is still live, set to close <span className="highlight-text"> Oct 28, 2018 </span>
              </Aux> : <Aux>This campaing <span className="highlight-text">has succeed</span></Aux>
            }
          </Header>
          <p>
            {stage === 'LIVE' ?
              <Aux>
                Campaign has not reached minimum required amount.
                MobCycle raised <b> $90,000 </b> out of required <b>$100,000</b>
              </Aux> :
              <Aux>
              Campaign has reached minimum required amount. MobCycle raised <b>$350,000</b>
                {' '}from <b>227 investors</b> .
              </Aux>
          }
          </p>
          <Divider section />
          <Step.Group className="campaign-close">
            {['Fund Escrow', 'Process Notes', 'Finalize envelopes', 'Finalize closure'].map((item, index) => (
              <Step active={this.state.activeStep === (index + 1)}>
                <Label circular color={this.state.activeStep === (index + 1) ? 'blue' : 'grey'}>{index + 1}</Label>
                <Step.Content>
                  <Step.Title>{item}</Step.Title>
                </Step.Content>
              </Step>
            ))
            }
          </Step.Group>
          {this.state.activeStep === 1 &&
          <Aux>
            <Header as="h4" className="mt-40 mb-30">Start funding escrow</Header>
            <Button primary onClick={this.showConfirmBox}>Fund Escrow</Button>
            <Divider className="doubled" />
          </Aux>
          }
          {this.state.activeStep === 2 &&
            <Aux>
              <Header as="h4" className="mt-40 mb-30">Confirm</Header>
              <FormCheckbox
                fielddata={OFFERING_CLOSE_FRM.fields.checkboxes}
                name="checkboxes"
                changed
                defaults
                containerclassname="ui relaxed list"
              />
              <Button primary onClick={this.submitStep} className="mt-20">Process Notes</Button>
              <Divider className="doubled" />
            </Aux>
          }
          {this.state.activeStep === 3 &&
            <Aux>
              <Header as="h4" className="mt-40 mb-30">Finalize envelopes</Header>
              <p>This will finalize all investments in DocuSign.</p>
              <Button primary className="mt-20" onClick={this.showConfirmBox}>Close Envelopes </Button>
              <Divider className="doubled" />
            </Aux>
          }
          {this.state.activeStep === 4 &&
            <Aux>
              {/* <Header as="h4" className="mt-40 mb-30">Envelopes processing
                <Header.Subheader>
                  It may take a moment, please complete the form below while processing.
                </Header.Subheader>
              </Header>
              <Grid>
                <Grid.Column width={7}>
                  <Progress percent={10} size="tiny"
                  color="green" className="campaign-close-progress">
                  34 of 420 investors processed...
                  </Progress>
                </Grid.Column>
              </Grid>
              <Divider hidden clearing />
              <Divider section clearing /> */}
              <Header as="h4" className="mt-40 mb-30">Finalize closure</Header>
              <Form>
                <Form.Group widths={3}>
                  {['disbursementDate', 'disbursementAmount', 'totalRepayment', 'totalCommittedAmount', 'totalInvestorCount'].map(field => (
                    <MaskedInput
                      name={field}
                      fielddata={OFFERING_CLOSE_FRM.fields[field]}
                      changed={(values, name) => maskChange(values, formName, name)}
                      dateOfBirth={field === 'disbursementDate'}
                      number={field === 'totalInvestorCount'}
                      currency={field !== 'totalInvestorCount' && field !== 'disbursementDate'}
                      prefix={field !== 'totalInvestorCount' && field !== 'disbursementDate' ? '$' : false}
                    />
                  ))
                  }
                </Form.Group>
              </Form>
              <Button.Group className="mt-50">
                <Button primary>Save draft</Button>
                <Button color="red" onClick={this.handleCloseOffering}>Close offering </Button>
              </Button.Group>
              <Divider hidden fitted clearing />
              <Button.Group>
                <Button icon color="blue" className="link-button">
                  <Icon className="ns-envelope-line" />
                  Send Test Close Mail
                </Button>
                {/* <Button as="span" className="time-stamp note">
              You cannot close the offering if envelopes are still being processed</Button> */}
              </Button.Group>
              <Divider className="doubled" />
            </Aux>
          }
          <Contingency
            formArrayChange={formArrayChange}
            form={CLOSING_CONTITNGENCIES_FRM}
            formName="CLOSING_CONTITNGENCIES_FRM"
            refTab="close"
            hideAddNewBtn
          />
        </div>
        <Confirm
          open={this.state.open}
          header="Please confirm"
          content={this.state.confirmContentTxt}
          onCancel={this.handleCancel}
          onConfirm={this.submitStep}
          cancelButton={this.state.cancelButtonTxt}
          confirmButton={this.state.confirmButtonTxt}
        />
      </Form>
    );
  }
}
