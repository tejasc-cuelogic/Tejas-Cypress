import React from 'react';
import StepZilla from 'react-stepzilla';
import { Modal } from 'semantic-ui-react';

import StepOne from './StepOne';
import StepTwo from './StepTwo';

const steps =
  [
    { name: 'Step 1', component: <StepOne /> },
    { name: 'Step 2', component: <StepTwo /> },
  ];

export default class LinkBankAccount extends React.Component {
  render() {
    return (
      <div className="step-progress">
        <Modal size="tiny" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
          <Modal.Content className="signup-content">
            <StepZilla steps={steps} />
          </Modal.Content>
        </Modal>
      </div>
      // <Modal size="tiny" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
      //   <Modal.Header className="center-align signup-header">
      //     <Header as="h2">
      //       Link Bank Account
      //     </Header>
      //     <Divider />
      //   </Modal.Header>
      //   <Modal.Content className="signup-content">
      //     <div className="center-align">
      //       <Button circular color="green" size="large" >Answer challenge questions</Button>
      //     </div>
      //     <div className="center-align">
      //       <Button className="cancel-link" >Correct Information</Button>
      //     </div>
      //   </Modal.Content>
      // </Modal>
    );
  }
}

