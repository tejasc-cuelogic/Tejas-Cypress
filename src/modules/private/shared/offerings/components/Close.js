import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import Aux from 'react-aux';
import { filter, find } from 'lodash';
import { Form, Header, Divider, Step, Label, Button, Icon, Confirm } from 'semantic-ui-react';
import Contingency from './overview/Contingency';
import { SCOPE_VALUES } from '../../../../../services/constants/admin/offerings';
import { MaskedInput, FormDropDown } from '../../../../../theme/form';
import { DataFormatter } from '../../../../../helper';

const closingActions = {
  ENUM1: { label: 'Soft Close Notification', ref: 1, enum: 'SOFT_CLOSE_NOTIFICATION' },
  ENUM2: { label: 'Confirm Balances', ref: 1, enum: 'CHECK_BALANCE' },
  ENUM3: { label: 'Issue Credits', ref: 1, enum: 'ISSUE_CREDITS' },
  ENUM4: { label: 'Fund Escrow', ref: 1, enum: 'FUND_ESCROW' },
  ENUM5: { label: 'Process Notes', ref: 2, enum: 'PROCESS_NOTES' },
  ENUM6: { label: 'Finalize Notes', ref: 2, enum: 'FINALIZE_NOTES' },
  ENUM7: { label: 'Close', ref: 3, enum: 'save' },
  ENUM8: {
    label: 'Hard Close Notification', ref: 3, enum: 'HARD_CLOSE_NOTIFICATION', confirm: true,
  },
};

@inject('offeringCreationStore', 'offeringsStore', 'uiStore')
@observer
export default class Close extends Component {
  state = {
    activeStep: 1,
    confirmContentTxt: 'Are all transactions cleared?  Has it been at least 6 business days since the last deposit for any investment?',
    cancelButtonTxt: 'No, it has not',
    confirmButtonTxt: 'Yes, it has',
    open: false,
    action: '',
    confirmed: false,
  }

  componentWillMount() {
    this.props.offeringCreationStore.setFormData('OFFERING_CLOSE_FRM', 'closureSummary');
  }

  submitStep = () => {
    this.setState({ open: false, confirmed: true });
    const { activeStep, action } = this.state;
    this.closeAction(action, activeStep, true);
  }

  showConfirmBox = (meta) => {
    if (this.state.activeStep === 3) {
      this.setState({
        confirmContentTxt: `Are you sure you want to proceed with the ${meta.label}`,
        cancelButtonTxt: 'No, go back',
        confirmButtonTxt: 'Yes, proceed',
      });
    }
    this.setState({ open: true, action: meta.enum });
  }

  handleCancel = () => {
    this.setState({ open: false, action: '' });
  }

  toggleStep = activeStep => (this.setState({ activeStep }));

  closeAction = async (status, step, forced = false) => {
    const { offer } = this.props.offeringsStore;
    const { offeringClose } = this.props.offeringCreationStore;
    const { confirmed } = this.state;
    const confirmFor = find(closingActions, a => a.enum === status && a.confirm === true);
    if (confirmFor && confirmed === false && forced === false) {
      this.showConfirmBox(confirmFor);
    } else {
      if (status === 'save') {
        this.handleCloseOffering();
      } else {
        await offeringClose(
          {
            offeringId: offer.id,
            process: status,
          },
          step,
        );
      }
      this.setState({ confirmed: false, action: '' });
    }
  }

  handleCloseOffering = () => {
    const {
      updateOfferingMutation,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    new Promise((res, rej) => {
      updateOfferingMutation(
        currentOfferingId, { stage: 'STARTUP_PERIOD' }, 'CLOSEOFFERING',
        true, 'Offering Closed successfully.', false, res, rej,
      );
    })
      .then(() => {
        this.props.history.push(`/app/offerings/completed/edit/${currentOfferingId}/overview`);
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
    const { inProgress } = this.props.uiStore;
    const formName = 'OFFERING_CLOSE_FRM';
    const { offer } = this.props.offeringsStore;
    const closeDate = offer.closureSummary && offer.closureSummary.processingDate;
    const hoursToClose = DataFormatter.diffDays(closeDate, true) + 24;
    return (
      <Form>
        <div className="inner-content-spacer">
          <Header as="h4">
            {hoursToClose > 0
              ? (
<Aux>This campaing is still live, set to close <span className="highlight-text"> {closeDate ? moment(closeDate, 'MM-DD-YYYY').format('MMM D, YYYY') : 'N/A'} </span>
              </Aux>
              ) : <Aux>This campaing <span className="highlight-text">has succeed</span></Aux>
            }
          </Header>
          <p>
            {hoursToClose > 0
              ? (
<Aux>
                Campaign has not reached minimum required amount.
                MobCycle raised <b> $90,000 </b> out of required <b>$100,000</b>
              </Aux>
              )
              : (
<Aux>
              Campaign has reached minimum required amount. MobCycle raised <b>$350,000</b>
                {' '}from <b>227 investors</b> .
              </Aux>
              )
          }
          </p>
          <Divider section />
          {hoursToClose <= 0
            && (
<Aux>
              <Step.Group className="campaign-close">
                {['Fund Escrow', 'Process Notes', 'Finalize closure'].map((item, index) => (
                  <Step
                    style={{ background: 'none', textDecoration: 'none' }}
                    onClick={() => this.toggleStep(index + 1)}
                    active={this.state.activeStep === (index + 1)}
                  >
                    <Label circular color={this.state.activeStep === (index + 1) ? 'blue' : 'grey'}>{index + 1}</Label>
                    <Step.Content>
                      <Step.Title>{item}</Step.Title>
                    </Step.Content>
                  </Step>
                ))
                }
              </Step.Group>
              {this.state.activeStep === 1
              && (
<Aux>
                <Form.Group widths={3}>
                  <MaskedInput
                    name="queueLimit"
                    containerwidth="4"
                    fielddata={OFFERING_CLOSE_1.fields.queueLimit}
                    changed={(values, name) => maskChange(values, 'OFFERING_CLOSE_1', name)}
                    number
                  />
                </Form.Group>
                <Button.Group className="mt-50">
                  {filter(closingActions, a => a.ref === 1).map(fA => (
                    <Button
                      loading={inProgress === fA.enum}
                      onClick={() => this.closeAction(fA.enum, 1)}
                      primary
                    >{fA.label}
                    </Button>
                  ))}
                </Button.Group>
                <Divider className="doubled" />
              </Aux>
              )
              }
              {this.state.activeStep === 2
                && (
<Aux>
                  <Form.Group widths={3}>
                    {['queueLimit', 'notePurchaseDate'].map(field => (
                      <MaskedInput
                        name={field}
                        containerwidth="4"
                        fielddata={OFFERING_CLOSE_2.fields[field]}
                        changed={(values, name) => maskChange(values, 'OFFERING_CLOSE_2', name)}
                        dateOfBirth={field === 'notePurchaseDate'}
                        number={field === 'queueLimit'}
                      />
                    ))
                    }
                  </Form.Group>
                  <Button.Group className="mt-50">
                    {filter(closingActions, a => a.ref === 2).map(fA => (
                      <Button
                        loading={inProgress === fA.enum}
                        onClick={() => this.closeAction(fA.enum, 2)}
                        primary
                      >{fA.label}
                      </Button>
                    ))}
                  </Button.Group>
                  <Divider className="doubled" />
                </Aux>
                )
              }
              {this.state.activeStep === 3
                && (
<Aux>
                  <Form.Group widths={3}>
                    {
                      Object.keys(OFFERING_CLOSE_3.fields).filter(f => f !== 'scope').map(field => (
                        <MaskedInput
                          key={field}
                          name={field}
                          number={['queueLimit', 'interestRate', 'revSharePercentage'].includes(field)}
                          currency={['nsPayment', 'investorFee', 'multiple'].includes(field)}
                          dateOfBirth={['maturityDate', 'hardCloseDate'].includes(field)}
                          fielddata={OFFERING_CLOSE_3.fields[field]}
                          changed={(values, name) => maskChange(values, 'OFFERING_CLOSE_3', name)}
                        />
                      ))
                    }
                    <FormDropDown
                      fielddata={OFFERING_CLOSE_3.fields.scope}
                      selection
                      value={OFFERING_CLOSE_3.fields.scope.value}
                      placeholder="Choose here"
                      name="scope"
                      options={SCOPE_VALUES}
                      onChange={(e, result) => formArrayChange(e, result, 'OFFERING_CLOSE_3')}
                    />
                  </Form.Group>
                  <Button.Group className="mt-50">
                    {filter(closingActions, a => a.ref === 3).map(fA => (
                      <Button
                        loading={inProgress === fA.enum}
                        onClick={() => this.closeAction(fA.enum, 3)}
                        primary
                      >{fA.label}
                      </Button>
                    ))}
                  </Button.Group>
                  <Divider className="doubled" />
                </Aux>
                )
              }
              {this.state.activeStep === 4 && false
                && (
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
                )
              }
            </Aux>
            )
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
