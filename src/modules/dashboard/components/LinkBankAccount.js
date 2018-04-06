import React from 'react';
import { Modal } from 'semantic-ui-react';
import { Multistep } from 'react-multistep';
import StepOne from './StepOne';
import { StepTwo } from './StepTwo';

const steps = [
  { name: 'StepOne', component: <StepOne /> },
  { name: 'StepTwo', component: <StepTwo /> },
];

export class LinkBankAccount extends React.Component {
  render() {
    return (
      <Modal size="tiny" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Multistep steps={steps} />
        {/* <Modal.Header className="center-align signup-header">
          <Header as="h2">
            Link Bank Account
          </Header>
          <Divider />
        </Modal.Header>
        <Modal.Content className="signup-content">
          <div className="center-align">
            <Button circular color="green" size="large" >Answer challenge questions</Button>
          </div>
          <div className="center-align">
            <Button className="cancel-link" >Correct Information</Button>
          </div>
        </Modal.Content> */}
      </Modal>
    );
  }
}
