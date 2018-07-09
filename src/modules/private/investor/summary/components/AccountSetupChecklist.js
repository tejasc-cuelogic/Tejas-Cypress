import React from 'react';
import { Button, Card } from 'semantic-ui-react';

const AccountSetupChecklist = props => (
  <Card.Description>
    <Button disabled primary content="Let's start it!" className="relaxed" onClick={() => props.setDashboardWizardSetup('InvestmentChooseType')} />
  </Card.Description>
);

export default AccountSetupChecklist;
