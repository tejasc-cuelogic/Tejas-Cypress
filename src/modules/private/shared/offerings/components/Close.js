import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import { filter, find, get } from 'lodash';
import { Form, Card, Header, Divider, Step, Label, Button, Icon, Confirm, Modal } from 'semantic-ui-react';
import Contingency from './overview/Contingency';
// import { SCOPE_VALUES } from '../../../../../services/constants/admin/offerings';
import { MaskedInput, FormInput } from '../../../../../theme/form';
import { DataFormatter } from '../../../../../helper';
import Helper from '../../../../../helper/utility';

const closingActions = {
  ENUM1: { label: 'save', ref: 1, enum: 'update' },
  ENUM2: { label: 'Soft Close Notification', ref: 2, enum: 'SOFT_CLOSE_NOTIFICATION' },
  ENUM3: { label: 'Confirm Balances', ref: 2, enum: 'CHECK_BALANCE' },
  ENUM4: { label: 'Issue Credits', ref: 2, enum: 'ISSUE_CREDITS' },
  ENUM5: { label: 'Fund Escrow', ref: 2, enum: 'FUND_ESCROW' },
  ENUM6: {
    label: 'Verify Escrow', ref: 3, enum: 'VERIFY_SECURITY_TRANSACTION',
  },
  ENUM7: { label: 'Process Notes', ref: 3, enum: 'PROCESS_NOTES' },
  ENUM8: { label: 'Finalize Notes', ref: 3, enum: 'FINALIZE_NOTES' },
  ENUM9: { label: 'Close', ref: 4, enum: 'close' },
  ENUM10: {
    label: 'Hard Close Notification', ref: 4, enum: 'HARD_CLOSE_NOTIFICATION',
  },
};

@inject('offeringCreationStore', 'offeringsStore', 'uiStore')
@observer
export default class Close extends Component {
  state = {
    openModal: false,
    activeStep: 1,
    confirmContentTxt: 'Are all transactions cleared?  Has it been at least 6 business days since the last deposit for any investment?',
    cancelButtonTxt: 'No, it has not',
    confirmButtonTxt: 'Yes, it has',
    open: false,
    action: '',
    confirmed: false,
    inProgress: false,
  }

  componentWillMount() {
    this.props.offeringCreationStore.setFormData('OFFERING_CLOSE_FRM', 'closureSummary');
    this.props.offeringCreationStore.setFormData('OFFERING_CLOSE_1');
  }

  submitStep = () => {
    this.setState({ open: false, confirmed: true });
    const { activeStep, action } = this.state;
    this.closeAction(action, activeStep, true);
  }

  showConfirmBox = (meta) => {
    if (this.state.activeStep === 4) {
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
    } else if (status === 'SOFT_CLOSE_NOTIFICATION' || status === 'HARD_CLOSE_NOTIFICATION') {
      this.setState({ openModal: true, action: status });
    } else {
      if (status === 'close' || status === 'update') {
        this.handleUpdateOffering(status);
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

  handleHardOrSoftClose = (type) => {
    const { offer } = this.props.offeringsStore;
    const { offeringClose } = this.props.offeringCreationStore;
    switch (type) {
      case 'Cancel':
        this.handleCloseModal();
        break;
      case 'Send to Test Email':
        offeringClose({
          offeringId: offer.id,
          process: this.state.action,
        }, this.state.activeStep, 'ADMIN');
        this.handleCloseModal();
        break;
      case 'Send to Investors':
        offeringClose({
          offeringId: offer.id,
          process: this.state.action,
        }, this.state.activeStep, 'INVESTOR');
        this.handleCloseModal();
        break;
      default: break;
    }
  }

  handleCloseModal = () => {
    this.setState({ openModal: false });
  }

  handleUpdateOffering = (status) => {
    const {
      updateOfferingMutation,
      currentOfferingId,
      getClosureObject,
    } = this.props.offeringCreationStore;
    new Promise((res, rej) => {
      let payload = { stage: 'STARTUP_PERIOD' };
      if (status === 'update') {
        payload = getClosureObject();
      }
      this.setState({ inProgress: status });
      updateOfferingMutation(
        currentOfferingId, payload, status === 'close' ? 'CLOSEOFFERING' : false,
        true, `Offering ${status === 'update' ? 'Updated' : 'Closed'} successfully.`, false, res, rej,
      );
    })
      .then(() => {
        this.setState({ inProgress: false });
        if (status === 'close') {
          this.props.history.push(`/app/offerings/completed/edit/${currentOfferingId}/overview`);
        }
      }).catch(() => {
        this.setState({ inProgress: false });
      });
  }

  render() {
    const {
      OFFERING_CLOSE_FRM,
      OFFERING_CLOSE_1,
      OFFERING_CLOSE_2,
      OFFERING_CLOSE_3,
      OFFERING_CLOSE_4,
      CLOSING_CONTITNGENCIES_FRM,
      maskChange,
      formArrayChange, formChange,
    } = this.props.offeringCreationStore;
    const { inProgress } = this.props.uiStore;
    const formName = 'OFFERING_CLOSE_FRM';
    const { offer, offerStatus } = this.props.offeringsStore;
    const closeDate = offer.closureSummary && offer.closureSummary.processingDate;
    const hoursToClose = DataFormatter.diffDays(closeDate, true) + 24;
    return (
      <Form>
        <div className="inner-content-spacer">
          <Header as="h4">
            {hoursToClose > 0
              ? (
                <>This campaign is still live, set to close <span className="highlight-text"> {closeDate ? moment(closeDate, 'MM-DD-YYYY').format('MMM D, YYYY') : 'N/A'} </span>
                </>
              ) : <>This campaign <span className={offerStatus.isFailed ? 'negative-text' : 'highlight-text'}> {offerStatus.isFailed ? 'has failed' : 'has succeed'}</span></>
            }
          </Header>
          <p>
            <>
              Campaign has
{!offerStatus.isFailed ? ' reached' : ' not reached'}
              {' '}
              minimum required amount.
                {' '}
              {get(offer, 'keyTerms.shorthandBusinessName')}
              {' '}
              raised
                {' '}
              <b>{Helper.CurrencyFormat(get(offer, 'closureSummary.totalInvestmentAmount'), 0)}</b>
              {' '}
              out of required
                  {' '}
              <b>{Helper.CurrencyFormat(offerStatus.minOffering || 0, 0)}</b>
            </>
          </p>
          <Divider section />
          {((hoursToClose <= 0 && !offerStatus.isFailed) || true)
            ? (
              <>
                <Step.Group className="campaign-close">
                  {['Offering Close Inputs', 'Fund Escrow', 'Process Notes', 'Finalize Closure'].map((item, index) => (
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
                    (
                      <>
                        <Form.Group widths={3}>
                          {['investorFee', 'maturityDate', 'hardCloseDate', 'interestRate', 'revSharePercentage', 'multiple', 'anticipatedPaymentStartDate', 'gsFees', 'nsPayment'].map(field => (
                            <MaskedInput
                              key={field}
                              name={field}
                              number={['interestRate', 'revSharePercentage'].includes(field)}
                              currency={['nsPayment', 'investorFee', 'multiple', 'nsFee', 'gsFees'].includes(field)}
                              dateOfBirth={['maturityDate', 'hardCloseDate', 'anticipatedPaymentStartDate'].includes(field)}
                              fielddata={OFFERING_CLOSE_1.fields[field]}
                              changed={(values, name) => maskChange(values, 'OFFERING_CLOSE_1', name)}
                            />
                          ))
                          }
                        </Form.Group>
                        <Header as="h4">Linked Bank</Header>
                        <Form.Group widths={3}>
                          {['bankName', 'accountHolderName'].map(field => (
                            <FormInput
                              key={field}
                              name={field}
                              fielddata={OFFERING_CLOSE_1.fields[field]}
                              changed={(e, result) => formChange(e, result, 'OFFERING_CLOSE_1')}
                            />
                          ))
                          }
                          {['accountNumber', 'routingNumber'].map(field => (
                            <MaskedInput
                              key={field}
                              name={field}
                              number
                              fielddata={OFFERING_CLOSE_1.fields[field]}
                              changed={(values, name) => maskChange(values, 'OFFERING_CLOSE_1', name)}
                            />
                          ))
                          }
                        </Form.Group>
                        <Button.Group className="mt-50">
                          {filter(closingActions, a => a.ref === 1).map(fA => (
                            <Button
                              loading={this.state.inProgress === fA.enum}
                              onClick={() => this.closeAction(fA.enum, 1)}
                              primary
                            >
                              {fA.label}
                            </Button>
                          ))}
                        </Button.Group>
                        <Divider className="doubled" />
                      </>
                    )
                  )
                }
                {this.state.activeStep === 2
                  && (
                    <>
                      <Form.Group widths={3}>
                        <MaskedInput
                          name="queueLimit"
                          containerwidth="4"
                          fielddata={OFFERING_CLOSE_2.fields.queueLimit}
                          changed={(values, name) => maskChange(values, 'OFFERING_CLOSE_2', name)}
                          number
                        />
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
                    </>
                  )
                }
                {this.state.activeStep === 3
                  && (
                    <>
                      <Form.Group widths={3}>
                        {['queueLimit', 'notePurchaseDate'].map(field => (
                          <MaskedInput
                            name={field}
                            containerwidth="4"
                            fielddata={OFFERING_CLOSE_3.fields[field]}
                            changed={(values, name) => maskChange(values, 'OFFERING_CLOSE_3', name)}
                            dateOfBirth={field === 'notePurchaseDate'}
                            number={field === 'queueLimit'}
                          />
                        ))
                        }
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
                    </>
                  )
                }
                {this.state.activeStep === 4
                  && (
                    <>
                      <Form.Group widths={3}>
                        <MaskedInput
                          name="queueLimit"
                          containerwidth="4"
                          fielddata={OFFERING_CLOSE_4.fields.queueLimit}
                          changed={(values, name) => maskChange(values, 'OFFERING_CLOSE_2', name)}
                          number
                        />
                      </Form.Group>
                      <Button.Group className="mt-50">
                        {filter(closingActions, a => a.ref === 4).map(fA => (
                          <Button
                            loading={inProgress === fA.enum}
                            onClick={() => this.closeAction(fA.enum, 4)}
                            primary
                          >
                            {fA.label}
                          </Button>
                        ))}
                      </Button.Group>
                    </>
                  )
                }
                {this.state.activeStep === 5 && false
                  && (
                    <>
                      <Header as="h4" className="mt-40 mb-30">Finalize Closure</Header>
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
                        <Button color="red" onClick={this.handleUpdateOffering}>Close offering </Button>
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
                    </>
                  )
                }
              </>
            ) : !(hoursToClose > 0) && offerStatus.isFailed ? (
              <Card fluid className="center-align ba-info-card">
                <Card.Header>
                  This campaign has Failed
                </Card.Header>
              </Card>
            ) : null
          }
          <Contingency
            formArrayChange={formArrayChange}
            form={CLOSING_CONTITNGENCIES_FRM}
            formName="CLOSING_CONTITNGENCIES_FRM"
            refTab="close"
            OfferingClose
          />
        </div>
        <Modal open={this.state.openModal} closeIcon size="tiny" onClose={this.handleCloseModal}>
          <Modal.Header>
            {this.state.activeStep === 2 ? 'Soft Close Notification' : 'Hard close Notification'}
          </Modal.Header>
          <Modal.Content className="pb-20">
            Please select notification action to perform.
          </Modal.Content>
          <Modal.Actions>
            <Button.Group className="actions">
              {['Cancel', 'Send to Test Email', 'Send to Investors'].map(item => (
                <Button
                  onClick={() => this.handleHardOrSoftClose(item)}
                  primary={item !== 'Cancel'}
                  content={item}
                />
              ))
              }
            </Button.Group>
          </Modal.Actions>
        </Modal>
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
