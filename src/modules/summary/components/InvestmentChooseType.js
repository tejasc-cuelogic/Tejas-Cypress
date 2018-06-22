import React from 'react';
import { observer } from 'mobx-react';
import find from 'lodash/find';
import { Modal, Grid, Button, Header, Form } from 'semantic-ui-react';
import { FormRadioGroup } from '../../../theme/form/FormElements';

const getOptionDetails = (accType) => {
  if (accType) {
    const { value, values } = accType;
    const isAccExist = find(values, { value: accType.value });
    if (isAccExist) {
      return find(values, v => v.value === value).description;
    }
  }
  return true;
};

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
          <div className="option-details">
            {getOptionDetails(props.investmentAccTypes.fields.accType)}
          </div>
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
