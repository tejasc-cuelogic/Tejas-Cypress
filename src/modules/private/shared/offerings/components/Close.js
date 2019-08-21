import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import omitDeep from 'omit-deep';
import { filter, find, get, capitalize } from 'lodash';
import beautify from 'json-beautify';
import { Form, Card, Header, Divider, Step, Label, Button, Icon, Confirm, Modal, Grid, Table } from 'semantic-ui-react';
import Contingency from './overview/Contingency';
// import { SCOPE_VALUES } from '../../../../../services/constants/admin/offerings';
import { MaskedInput, FormInput } from '../../../../../theme/form';
import { DataFormatter } from '../../../../../helper';
import Helper from '../../../../../helper/utility';
import { FieldError } from '../../../../../theme/shared';
import { CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../constants/offering';

const closingActions = {
  ENUM1: { label: 'save', ref: 1, enum: 'update' },
  ENUM2: { label: 'Soft Close Notification', keyToEnable: false, ref: 2, enum: 'SOFT_CLOSE_NOTIFICATION' },
  ENUM3: { label: 'Confirm Balances', keyToEnable: 'softCloseNotification.status', ref: 2, enum: 'CHECK_BALANCE' },
  ENUM4: { label: 'Issue Credits', keyToEnable: 'checkBalance.status', ref: 2, enum: 'ISSUE_CREDITS' },
  ENUM5: { label: 'Fund Escrow', keyToEnable: 'issueCredits.status', ref: 2, enum: 'FUND_ESCROW' },
  ENUM6: {
    label: 'Verify Escrow', keyToEnable: 'fundEscrow.status', ref: 3, enum: 'VERIFY_SECURITY_TRANSACTION',
  },
  ENUM7: { label: 'Process Notes', keyToEnable: false, ref: 3, enum: 'PROCESS_NOTES' },
  ENUM8: { label: 'Validate Envelope', keyToEnable: 'processNotes.status', ref: 3, enum: 'VALIDATE_NOTES' },
  ENUM9: { label: 'Finalize Envelope', keyToEnable: 'validateNotes.status', ref: 3, enum: 'FINALIZE_NOTES' },
  ENUM10: { label: 'Close', keyToEnable: 'finalizeNotes.status', ref: 4, enum: 'close' },
  ENUM11: {
    label: 'Hard Close Notification', keyToEnable: 'finalizeNotes.status', ref: 4, enum: 'HARD_CLOSE_NOTIFICATION',
  },
  ENUM12: {
    label: 'Export Envelopes', keyToEnable: 'finalizeNotes.status', ref: 4, enum: 'EXPORT_ENVELOPES',
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
    visibilityStatus: false,
    actionLabel: '',
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

  toggleStep = (activeStep) => {
    this.setState({ activeStep });
    this.props.offeringCreationStore.setFieldValue('outputMsg', null);
  };

  closeAction = async (status, step, forced = false, actionLabel = '') => {
    const { offer } = this.props.offeringsStore;
    const { offeringClose } = this.props.offeringCreationStore;
    const { confirmed } = this.state;
    const confirmFor = find(closingActions, a => a.enum === status && a.confirm === true);
    if (confirmFor && confirmed === false && forced === false) {
      this.showConfirmBox(confirmFor);
    } else if (status === 'SOFT_CLOSE_NOTIFICATION' || status === 'HARD_CLOSE_NOTIFICATION' || status === 'PROCESS_NOTES' || status === 'VALIDATE_NOTES') {
      this.setState({ openModal: true, action: status, actionLabel });
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
      this.setState({ confirmed: false, action: '', actionLabel });
    }
  }

  handleHardOrSoftClose = (type) => {
    const { offer } = this.props.offeringsStore;
    const { offeringClose, resetForm } = this.props.offeringCreationStore;
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
      case 'Validate Envelope':
        offeringClose({
          offeringId: offer.id,
          process: this.state.action,
        }, this.state.activeStep);
        resetForm('OFFERING_CLOSE_3', ['npaPageCount', 'pnPageCount', 'documentsCount']);
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

  jsonModal = json => (
  <Modal closeIcon trigger={<Button className="link-button highlight-text" content={`Show ${this.state.actionLabel} Response`} />}>
      <Modal.Content>
      <pre className="no-updates bg-offwhite padded json-text">
        {beautify(json, null, 2, 100)}
      </pre>
      </Modal.Content>
      </Modal>
  );

  toggleVisibilityStatus = () => {
    const currStatus = this.state.visibilityStatus;
    this.setState({ visibilityStatus: !currStatus });
  }

  processClosureProcessObj = (obj) => {
    const orderedObj = {};
    if (obj) {
      const closureProcess = omitDeep(obj, ['__typename']);
      ['softCloseNotification', 'checkBalance', 'issueCredits', 'fundEscrow', 'verifySecurityTransaction', 'processNotes', 'validateNotes', 'finalizeNotes', 'hardCloseNotification', 'exportEnvelopes'].forEach((key) => {
        orderedObj[key] = closureProcess[key];
      });
    }
    return orderedObj;
  }

  render() {
    const {
      OFFERING_CLOSE_FRM,
      OFFERING_CLOSE_1,
      OFFERING_CLOSE_2,
      OFFERING_CLOSE_3,
      OFFERING_CLOSE_4,
      CLOSING_CONTITNGENCIES_FRM,
      maskChange, outputMsg,
      formArrayChange, formChange,
    } = this.props.offeringCreationStore;
    const { inProgress } = this.props.uiStore;
    const formName = 'OFFERING_CLOSE_FRM';
    const { offer, offerStatus } = this.props.offeringsStore;
    let { closureProcess } = offer;
    closureProcess = this.processClosureProcessObj(closureProcess);
    const closeDate = get(offer, 'closureSummary.processingDate') && `${get(offer, 'closureSummary.processingDate')} 23:59:59`;
    const hoursToClose = DataFormatter.diffDays(closeDate, true) + 24;
    const dynamicFields = get(offer, 'keyTerms.securities') === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE ? ['interestRate'] : ['revSharePercentage', 'multiple'];
    return (
      <Form>
        <div className="inner-content-spacer">
          <Header as="h4">
            {hoursToClose > 0
              ? (
<>This campaign is still live, set to close <span className="highlight-text"> {closeDate ? DataFormatter.getDateAsPerTimeZone(closeDate, true, false, false, 'MMM D, YYYY') : 'N/A'} </span>
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
                      {['investorFee', 'maturityDate', 'hardCloseDate', ...dynamicFields, 'anticipatedPaymentStartDate', 'gsFees', 'nsPayment'].map(field => (
                          <MaskedInput
                            key={field}
                            name={field}
                            percentage={['interestRate', 'revSharePercentage'].includes(field)}
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
                          onClick={() => this.closeAction(fA.enum, 1, false, fA.label)}
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
                {outputMsg && outputMsg.data
                && (
                  <>
                  {outputMsg.type === 'success'
                    ? (<div>{this.jsonModal(outputMsg.data)}</div>)
                    : (<FieldError error={outputMsg.data} />)
                  }
                  </>
                )
                }
                <Button.Group className="mt-50">
                  {filter(closingActions, a => a.ref === 2).map(fA => (
                    <Button
                      loading={inProgress === fA.enum}
                      onClick={() => this.closeAction(fA.enum, 2, false, fA.label)}
                      primary
                      disabled={fA.keyToEnable !== false && !(fA.keyToEnable ? get(closureProcess, fA.keyToEnable) === 'COMPLETE' : false)}
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
                  {outputMsg && outputMsg.data
                && (
                  <>
                  {outputMsg.type === 'success'
                    ? (<div>{this.jsonModal(outputMsg.data)}</div>)
                    : (<FieldError error={outputMsg.data} />)
                  }
                  </>
                )
                }
                  <Button.Group className="mt-50">
                    {filter(closingActions, a => a.ref === 3).map(fA => (
                      <Button
                        loading={inProgress === fA.enum}
                        disabled={fA.keyToEnable !== false && !(fA.keyToEnable ? get(closureProcess, fA.keyToEnable) === 'COMPLETE' : false)}
                        onClick={() => this.closeAction(fA.enum, 3, false, fA.label)}
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
                {outputMsg && outputMsg.data
                && (
                  <>
                  {outputMsg.type === 'success'
                    ? (<div>{this.jsonModal(outputMsg.data)}</div>)
                    : (<FieldError error={outputMsg.data} />)
                  }
                  </>
                )
                }
                <Button.Group className="mt-50">
                {filter(closingActions, a => a.ref === 4).map(fA => (
                  <Button
                    loading={inProgress === fA.enum}
                    disabled={fA.keyToEnable !== false && !(fA.keyToEnable ? get(closureProcess, fA.keyToEnable) === 'COMPLETE' : false)}
                    onClick={() => this.closeAction(fA.enum, 4, false, fA.label)}
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
          <Header as="h4"> Closure Process Status <Icon onClick={this.toggleVisibilityStatus} className={`ns-chevron-${this.state.visibilityStatus === true ? 'up' : 'down'}-compact right`} color="blue" /> </Header>
          {this.state.visibilityStatus
          && (
          <Grid columns={3}>
          {closureProcess ? Object.keys(closureProcess).map(key => (
            <Grid.Column className="center-align"><b>{capitalize(key.replace(/([a-z0-9])([A-Z])/g, '$1 $2'))}</b>
            <div className="table-wrapper">
            <Table unstackable basic="very">
              <Table.Body>
                {closureProcess[key] ? ['Status', 'Started', 'Finished'].map(k => (
                <Table.Row>
                  <Table.Cell>{k}</Table.Cell>
                  <Table.Cell>
                  {k === 'Status'
                    && (
                    <>
                    {closureProcess[key].status
                      ? (
                       <>
                      <b className={closureProcess[key].status === 'COMPLETE' ? 'positive-text' : closureProcess[key].status === 'PENDING' ? 'warning-text' : 'negative-text'}>{closureProcess[key].status}</b>
                      {closureProcess[key].finished && closureProcess[key].started
                      && (
                        <span> ({DataFormatter.getDateDifference(closureProcess[key].started, closureProcess[key].finished)})</span>
                      )
                      }
                      </>
                      )
                      : <>-</>
                    }
                    </>
                    )
                  }
                  {k === 'Started'
                  && (
                    <>
                    {(closureProcess[key].started || closureProcess[key].startedCount) ? (
                    <>
                      {closureProcess[key].startedCount || '0'} - {closureProcess[key].started ? DataFormatter.getDateAsPerTimeZone(closureProcess[key].started, true, false, false, 'MM-DD-YYYY h:mm a') : ''}
                    </>
                    ) : <>-</>
                  }
                    </>
                  )
                  }
                   {k === 'Finished'
                   && (
                  <>
                   {
                   (closureProcess[key].remainingCount || closureProcess[key].finished)
                     ? (
                    <>{closureProcess[key].remainingCount || '0'} - {closureProcess[key].finished ? DataFormatter.getDateAsPerTimeZone(closureProcess[key].finished, true, false, false, 'MM-DD-YYYY h:mm a') : ''}
                    </>
                     ) : <>-</>
                   }
                   </>
                   )
                    }
                  </Table.Cell>
                </Table.Row>
                )) : <p className="center-align mt-80">No Data Found</p>
                }
                </Table.Body>
              </Table>
            </div>
            </Grid.Column>
          ))
            : <p>No Data Found</p>}
          </Grid>
          )
          }
          <Divider section />
          <Contingency
            formArrayChange={formArrayChange}
            form={CLOSING_CONTITNGENCIES_FRM}
            formName="CLOSING_CONTITNGENCIES_FRM"
            refTab="close"
            OfferingClose
          />
        </div>
        <Modal open={this.state.openModal} closeIcon size={this.state.action === 'VALIDATE_NOTES' ? 'small' : 'tiny'} onClose={this.handleCloseModal}>
          <Modal.Header>
            {this.state.action === 'VALIDATE_NOTES' ? 'Validate Notes' : this.state.activeStep === 2 ? 'Soft Close Notification' : 'Hard close Notification'}
          </Modal.Header>
          {this.state.action !== 'VALIDATE_NOTES'
            && (
          <Modal.Content className="pb-20">
            Please select notification action to perform.
          </Modal.Content>
            )
          }
          <Modal.Actions>
            {this.state.action === 'VALIDATE_NOTES'
              ? (
            <Form>
            <Form.Group widths={3} className="left-align">
            {['npaPageCount', 'pnPageCount'].map(field => (
                  <FormInput
                    key={field}
                    name={field}
                    fielddata={OFFERING_CLOSE_3.fields[field]}
                    changed={(e, result) => formChange(e, result, 'OFFERING_CLOSE_3')}
                  />
            ))
              }
                  <MaskedInput
                    name="documentsCount"
                    containerwidth="4"
                    fielddata={OFFERING_CLOSE_3.fields.documentsCount}
                    changed={(values, name) => maskChange(values, 'OFFERING_CLOSE_3', name)}
                    number
                  />
              </Form.Group>
              {['Cancel', 'Validate Envelope'].map(item => (
              <Button
                onClick={() => this.handleHardOrSoftClose(item)}
                primary={item !== 'Cancel'}
                content={item}
              />
              ))
            }
            </Form>
              )
              : (
            <Button.Group className="actions">
            {['Cancel', 'Send to Test Email', 'Send to Investors'].map(item => (
              <Button
                onClick={() => this.handleHardOrSoftClose(item)}
                primary={item !== 'Cancel'}
                disabled={(item === 'Send to Investors' && this.state.activeStep !== 2) ? get(closureProcess, 'verifySecurityTransaction.status') !== 'COMPLETE' : false}
                content={item}
              />
            ))
            }
            </Button.Group>
              )
            }
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
