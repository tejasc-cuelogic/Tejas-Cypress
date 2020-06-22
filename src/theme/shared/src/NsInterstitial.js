import React from 'react';
import { Modal, Container, Grid, Header, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { indexOf, last } from 'lodash';

@inject('investorProfileStore', 'uiStore', 'individualAccountStore')
@observer
@withRouter
export default class ConfirmCancelModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
    };
  }

  handleNextStep = (endUrl) => {
    const { currentStep } = this.state;
    const { steps } = this.props.interstitialSteps;
    const lastStep = indexOf(steps, last(steps));
    if (this.state.currentStep !== lastStep) {
      this.setState({ currentStep: currentStep + 1 });
    } else this.props.history.push(endUrl);
  }

  handleClose = (url) => {
    this.props.history.push(url);
  }

  render() {
    const { responsiveVars } = this.props.uiStore;
    const { isMobile } = responsiveVars;
    const { url, endUrl, interstitialSteps, size, closeOnDimmerClick } = this.props;
    const stepToRender = interstitialSteps.steps[this.state.currentStep];
    return (
      <Modal size={size || 'large'} open className="finish-later" closeIcon onClose={() => this.handleClose(url)} closeOnDimmerClick={Boolean(closeOnDimmerClick)}>
        <Modal.Content>
          <Container className={`investor-signup-container ${responsiveVars.uptoTablet ? 'pl-10 pr-10 pt-55 pb-55 ' : 'pl-15 pr-15 pt-55 pb-55'}`}>
            <Grid>
              <Grid.Column widescreen={6} computer={6} tablet={16} mobile={16}>
                <Header as="h3">{stepToRender.header}</Header>
                <p>{stepToRender.content}</p>
                {!isMobile
                && (
                <>
                  <div className="dblock">
                    <Button primary green className="mt-30" onClick={() => this.handleNextStep(endUrl)}>{stepToRender.button}</Button>
                  </div>
                  <div className="progressWrap dblock">
                    {interstitialSteps.steps.map((step, index) => (
                      <span className="steps" key={step.stepToBeRendered} style={this.state.currentStep === index ? { backgroundColor: '#20C86D' } : { backgroundColor: '#E6E6E8' }} />
                    ))}
                  </div>
                </>
                )}
              </Grid.Column>
              <Grid.Column widescreen={10} computer={10} tablet={16} mobile={16}>
                {stepToRender.component}
                {stepToRender.note && stepToRender.note}
                {isMobile
                && (
                <>
                  <div className="dblock">
                    <Button primary green className="mt-30" onClick={() => this.handleNextStep(endUrl)}>{stepToRender.button}</Button>
                  </div>
                  <div className="progressWrap dblock">
                    {interstitialSteps.steps.map((step, index) => (
                      <span className="steps" key={step.stepToBeRendered} style={this.state.currentStep === index ? { backgroundColor: '#20C86D' } : { backgroundColor: '#E6E6E8' }} />
                    ))}
                  </div>
                </>
                )}
              </Grid.Column>
            </Grid>
          </Container>
        </Modal.Content>
      </Modal>
    );
  }
}
