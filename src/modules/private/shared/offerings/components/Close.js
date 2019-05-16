import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import Aux from 'react-aux';
import { filter } from 'lodash';
import { Form, Header, Divider, Step, Label, Button, Icon, Confirm } from 'semantic-ui-react';
import Contingency from './overview/Contingency';
import { MaskedInput } from '../../../../../theme/form';
import { DataFormatter } from '../../../../../helper';

const closingActions = {
  ENUM1: { label: 'Soft Close Notification', ref: 1, enum: 'SOFT_CLOSE_NOTIFICATION' },
  ENUM2: { label: 'Confrim Balances', ref: 1, enum: 'ENUM1' },
  ENUM3: { label: 'Issue Credits', ref: 1, enum: 'ENUM1' },
  ENUM4: { label: 'Fund Escrow', ref: 1, enum: 'ENUM1' },
  ENUM5: { label: 'Process Notes', ref: 2, enum: 'ENUM1' },
  ENUM6: { label: 'Finalize Notes', ref: 2, enum: 'ENUM1' },
  ENUM7: { label: 'Close', ref: 3, enum: 'ENUM1' },
  ENUM8: { label: 'Hard Close Notification', ref: 3, enum: 'ENUM1' },
};

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
  closeAction = async (status) => {
    const { offer } = this.props.offeringsStore;
    const { offeringClose } = this.props.offeringCreationStore;
    await offeringClose({
      offeringId: offer.id,
      process: status,
    });
    console.log(status);
  }
  handleCloseOffering = () => {
    const {
      updateOfferingMutation,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    new Promise((res, rej) => {
      updateOfferingMutation(
        currentOfferingId, { stage: 'STARTUP_PERIOD' }, false,
        true, 'Offering Closed successfully.', false, res, rej,
      );
    })
      .then(() => {
        this.props.history.push(`/app/offerings/engagement/edit/${currentOfferingId}/overview`);
      });
  }
  render() {
    const {
      OFFERING_CLOSE_FRM,
      OFFERING_CLOSE_1,
      OFFERING_CLOSE_2,
      OFFERING_CLOSE_3,
      CLOSING_CONTITNGENCIES_FRM,
      maskChange,
      formArrayChange,
    } = this.props.offeringCreationStore;
    const formName = 'OFFERING_CLOSE_FRM';
    const { offer } = this.props.offeringsStore;
    const closeDate = offer.closureSummary && offer.closureSummary.processingDate;
    const hoursToClose = DataFormatter.diffDays(closeDate, true) + 24;
    return (
      <Form>
        <div className="inner-content-spacer">
          <Header as="h4">
            {hoursToClose > 0 ?
              <Aux>This campaing is still live, set to close <span className="highlight-text"> {closeDate ? moment(closeDate, 'MM-DD-YYYY').format('MMM D, YYYY') : 'N/A'} </span>
              </Aux> : <Aux>This campaing <span className="highlight-text">has succeed</span></Aux>
            }
          </Header>
          <p>
            {hoursToClose > 0 ?
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
          {hoursToClose <= 0 &&
            <Aux>
              <Step.Group className="campaign-close">
                {['Fund Escrow', 'Process Notes', 'Finalize closure'].map((item, index) => (
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
                <MaskedInput
                  name="limit"
                  fielddata={OFFERING_CLOSE_1.fields.limit}
                  changed={(values, name) => maskChange(values, 'OFFERING_CLOSE_1', name)}
                  number
                />
                <Button.Group className="mt-50">
                  {filter(closingActions, a => a.ref === 1).map(fA => (
                    <Button onClick={() => this.closeAction(fA.enum)} primary>{fA.label}</Button>
                  ))}
                </Button.Group>
                <Divider className="doubled" />
              </Aux>
              }
              {this.state.activeStep === 2 &&
                <Aux>
                  {['limit', 'notePurchaseDate'].map(field => (
                    <MaskedInput
                      name={field}
                      fielddata={OFFERING_CLOSE_2.fields[field]}
                      changed={(values, name) => maskChange(values, 'OFFERING_CLOSE_2', name)}
                      dateOfBirth={field === 'notePurchaseDate'}
                      number={field === 'limit'}
                    />
                  ))
                  }
                  <Button.Group className="mt-50">
                    {filter(closingActions, a => a.ref === 2).map(fA => (
                      <Button onClick={() => this.closeAction(fA.enum)} primary>{fA.label}</Button>
                    ))}
                  </Button.Group>
                  <Divider className="doubled" />
                </Aux>
              }
              {this.state.activeStep === 3 &&
                <Aux>
                  <MaskedInput
                    name="limit"
                    fielddata={OFFERING_CLOSE_3.fields.limit}
                    changed={(values, name) => maskChange(values, 'OFFERING_CLOSE_3', name)}
                    number
                  />
                  <Button.Group className="mt-50">
                    {filter(closingActions, a => a.ref === 3).map(fA => (
                      <Button onClick={() => this.closeAction(fA.enum)} primary>{fA.label}</Button>
                    ))}
                  </Button.Group>
                  <Divider className="doubled" />
                </Aux>
              }
              {this.state.activeStep === 4 && false &&
                <Aux>
                  <Header as="h4" className="mt-40 mb-30">Finalize closure</Header>
                  <Form>
                    <Form.Group widths={3}>
                      {['date', 'amount', 'currentRepaidAmount', 'totalCommittedAmount', 'totalInvestorCount'].map(field => (
                        <MaskedInput
                          name={field}
                          fielddata={OFFERING_CLOSE_FRM.fields[field]}
                          changed={(values, name) => maskChange(values, formName, name)}
                          dateOfBirth={field === 'date'}
                          number={field === 'totalInvestorCount'}
                          currency={field !== 'totalInvestorCount' && field !== 'date'}
                          prefix={field !== 'totalInvestorCount' && field !== 'date' ? '$' : false}
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
            </Aux>
          }
          <Contingency
            formArrayChange={formArrayChange}
            form={CLOSING_CONTITNGENCIES_FRM}
            formName="CLOSING_CONTITNGENCIES_FRM"
            refTab="close"
            OfferingClose
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
