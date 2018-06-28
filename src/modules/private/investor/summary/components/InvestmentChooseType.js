import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Grid, Button, Header, Form } from 'semantic-ui-react';
import { FormRadioGroup } from '../../../theme/form';
import InvestmentDescription from './InvestmentDescription';

const InvestmentChooseType = observer(props => (
  <Modal open closeIcon onClose={() => props.setDashboardWizardStep()}>
    <Modal.Header className="center-align signup-header">
      <Header as="h1">What type of Investment Account would you like to start?</Header>
    </Modal.Header>
    <Modal.Content className="signup-content">
      <Header as="h4" textAlign="center">Choose an account type</Header>
      <Grid textAlign="center">
        <Form error className="account-type-tab">
          <FormRadioGroup
            fielddata={props.investmentAccTypes.fields.accType}
            name="accType"
            changed={props.handleAccoutTypeChange}
            containerclassname="button-radio center-align"
          />
          <InvestmentDescription
            accTypes={props.investmentAccTypes.fields.accType}
          />
        </Form>
      </Grid>
      <Button
        circular
        icon={{ className: 'ns-arrow-right' }}
        className="multistep__btn next active"
        onClick={() => props.setDashboardWizardStep(props.routeOnInvestmentTypeSelection)}
      />
    </Modal.Content>
  </Modal>
));

export default InvestmentChooseType;
