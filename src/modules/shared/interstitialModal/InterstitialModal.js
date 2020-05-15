// import React, { Component } from 'react';
// import { Modal, Button } from 'semantic-ui-react';
// import { observer } from 'mobx-react';
// import { withRouter, Link } from 'react-router-dom';

// @observer
// @withRouter
// export default class InterstitialModal extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       compState: this.props.stepToBeRendered || 0,
//       lastStep: false,
//     };
//   }

//   handleNextStep = () => {
//     const { compState } = this.state;
//     this.setState({ compState: compState + 1 });
//   }

//   lastStep() {
//     const arrLength = this.props.steps.length;
//     if (this.props.stepToBeRendered === this.props.steps[arrLength - 1]) {
//       this.setState({ lastStep: true });
//     }
//   }

//   render() {
//     ;
//     return (
//       <>
//         <Modal
//           basic
//           open
//           closeIcon
//           onClose={() => this.props.handleModalclose()}
//           size="large"
//           centered={false}
//           className="bg-white dimmer-visible multistep-modal"
//         >
//           {this.props.steps.length && currentStep.component}
//           {this.state.lastStep
//             ? <Button content="Explore All Offerings" as={Link} to="/offerings" />
//             : <Button content="Next" onClick={this.handleNextStep} />
//           }
//         </Modal>
//       </>
//     );
//   }
// }
