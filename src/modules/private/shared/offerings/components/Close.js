import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Form, Header, Divider, Step, Label, Button, Progress, Icon, Grid } from 'semantic-ui-react';
import Contingency from './overview/Contingency';
import Actions from './overview/Actions';
import { MaskedInput, FormCheckbox } from '../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class Close extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('OFFERING_CLOSE_FRM', 'closureSummary');
  }
  render() {
    const {
      OFFERING_CLOSE_FRM,
      CLOSING_CONTITNGENCIES_FRM,
      maskChange,
      formChangeWithIndex,
    } = this.props.offeringCreationStore;
    const formName = 'OFFERING_CLOSE_FRM';
    const checkboxesLeft = {
      value: [],
      values: [
        {
          label: '5/10 split agreed', value: '1',
        },
        {
          label: 'Closing contigencies Sign-Off', value: '2',
        },
        {
          label: 'Escrow funded Propetly', value: '3',
        },
      ],
      error: undefined,
      rule: 'array',
    };
    return (
      <Form>
        <div className="inner-content-spacer">
          <Header as="h4">
            This campaign <span className="highlight-text">has succeed</span>
          </Header>
          <p>
            Campaign has reached minimum required amount. MobCycle raised <b>$350,000</b>
            {' '}from <b>227 investors</b> .
          </p>
          <Divider section />
          <Step.Group className="campaign-close">
            <Step active>
              <Label circular color="blue">1</Label>
              <Step.Content>
                <Step.Title>Fund Escrow</Step.Title>
              </Step.Content>
            </Step>
            <Step>
              <Label circular color="grey">2</Label>
              <Step.Content>
                <Step.Title>Process Notes</Step.Title>
              </Step.Content>
            </Step>
            <Step>
              <Label circular color="grey">3</Label>
              <Step.Content>
                <Step.Title>Finalize envelopes</Step.Title>
              </Step.Content>
            </Step>
            <Step>
              <Label circular color="grey">4</Label>
              <Step.Content>
                <Step.Title>Finalize closure</Step.Title>
              </Step.Content>
            </Step>
          </Step.Group>
          {/* Step 1 */}
          <Header as="h4" className="mt-40 mb-30">Start funding escrow</Header>
          <Button primary>Fund Escrow</Button>
          <Divider className="doubled" />
          {/* Step 2 */}
          <Header as="h4" className="mt-40 mb-30">Confirm</Header>
          <FormCheckbox
            fielddata={checkboxesLeft}
            name="legalConfirmation"
            changed
            defaults
            containerclassname="ui relaxed list"
          />
          <Button primary className="mt-20">Process Notes</Button>
          <Divider className="doubled" />
          {/* Step 3 */}
          <Header as="h4" className="mt-40 mb-30">Finalize envelopes</Header>
          <p>This will finalize all investments in DocuSign.</p>
          <Button primary className="mt-20">Close Envelopes </Button>
          <Divider className="doubled" />
          {/* Step 4 */}
          <Header as="h4" className="mt-40 mb-30">Envelopes processing
            <Header.Subheader>
              It may take a moment, please complete the form below while processing.
            </Header.Subheader>
          </Header>
          <Grid>
            <Grid.Column width={7}>
              <Progress percent={10} size="tiny" color="green" className="campaign-close-progress">
              34 of 420 investors processed...
              </Progress>
            </Grid.Column>
          </Grid>
          <Divider hidden clearing />
          <Divider section clearing />
          <Header as="h4" className="mt-40 mb-30">Finalize closure</Header>
          <Form>
            <Form.Group widths={3}>
              <Form.Input
                fluid
                label="Disbursement Date"
                placeholder="MM/DD/YYYY"
              />
              <Form.Input
                fluid
                label="Disbursement Amount"
                placeholder="$ Enter amount"
              />
              <Form.Input
                fluid
                label="Total Repayment"
                placeholder="$ Enter amount "
              />
            </Form.Group>
          </Form>
          <Button.Group className="mt-50">
            <Button primary>Save draft</Button>
            <Button color="red">Close offering </Button>
          </Button.Group>
          <Divider hidden fitted clearing />
          <Button.Group>
            <Button icon color="blue" className="link-button">
              <Icon className="ns-envelope-line" />
              Send Test Close Mail
            </Button>
            <Button as="span" className="time-stamp note">You cannot close the offering if envelopes are still being processed</Button>
          </Button.Group>
          <Divider className="doubled" />
          <Contingency
            formChangeWithIndex={formChangeWithIndex}
            form={CLOSING_CONTITNGENCIES_FRM}
            formName="CLOSING_CONTITNGENCIES_FRM"
            addon={<Actions />}
            refTab="close"
          />
          <Header as="h4">Offer Closing Details</Header>
          <Form.Group widths={3}>
            {Object.keys(OFFERING_CLOSE_FRM.fields).map(field => (
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
        </div>
      </Form>
    );
  }
}
