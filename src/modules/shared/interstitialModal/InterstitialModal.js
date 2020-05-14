import React, { Component } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@observer
@withRouter
export default class InterstitialModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compState: this.props.stepToBeRendered || 0,
      lastStep: false,
    };
  }

  handleNextStep = () => {
    const { compState } = this.state;
    this.setState({ compState: compState + 1 });
  }

  lastStep() {
    this.props.steps.map((s) => {
      if (s.stepToBeRendered === this.props.steps.length) {
        return this.setState({ lastStep: true });
      }
      return null;
    });
  }

  render() {
    const currentStep = this.props.steps[this.state.compState];
    return (
      <>
        <Modal
          basic
          open
          closeIcon
          onClose={() => this.props.handleModalclose()}
          size="large"
          centered={false}
          className="bg-white dimmer-visible multistep-modal"
        >
          {currentStep && currentStep.component}
          <Button content={!this.state.lastStep ? 'Next' : 'Explore All Offerings'} onClick={this.handleNextStep} />
        </Modal>
      </>
    );
  }
}
