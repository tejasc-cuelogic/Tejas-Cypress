import React from 'react';
import { Modal, Container, Grid, Header, Button } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { last } from 'lodash';

const getModule = component => lazyRetry(() => import(`./${component}`));

const ProgressBar = ({ activeStep, activeIndex }) => (
  <span className="steps" style={activeStep === activeIndex ? { backgroundColor: '#20C86D' } : { backgroundColor: '#E6E6E8' }} />
);

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

  handleNextStep = () => {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep + 1 });
  }

  handleFinishLater = (e, url) => {
    e.preventDefault();
    this.props.history.push(url);
  }

  render() {
    const { responsiveVars } = this.props.uiStore;
    const { isMobile } = responsiveVars;
    const { url, offerings, interstitialSteps, size, closeOnDimmerClick } = this.props;
    const stepToRender = interstitialSteps.steps[this.state.currentStep];
    const lastStep = last(interstitialSteps.steps);
    const CurrentComponent = getModule(stepToRender.component);
    return (
      <Modal size={size || 'large'} open className="finish-later" closeIcon onClose={e => this.handleFinishLater(e, url)} closeOnDimmerClick={Boolean(closeOnDimmerClick)}>
        <Modal.Content>
          <Container className={`investor-signup-container ${responsiveVars.uptoTablet ? 'pl-10 pr-10 pt-55 pb-55 ' : 'pl-15 pr-15 pt-55 pb-55'}`}>
            <Grid>
              <Grid.Column widescreen={6} computer={6} tablet={16} mobile={16} className="">
                <Header as="h3">{stepToRender.header}</Header>
                <p>{stepToRender.content}</p>
                <div className={isMobile ? 'dnone' : 'dblock'}>
                  {this.state.currentStep !== lastStep
                    ? <Button primary green className="mt-30" onClick={() => this.handleNextStep()}>{stepToRender.button}</Button>
                    : <Button primary green className="mt-30" as={Link} to={stepToRender.to}>{stepToRender.button}</Button>
                  }
                </div>
                <div className={`progressWrap ${isMobile ? 'dnone' : 'dblock'}`}>
                  {interstitialSteps.steps.map((step, index) => (
                    <ProgressBar
                      activeStep={this.state.currentStep}
                      activeIndex={index}
                    />
                  ))}
                </div>
              </Grid.Column>
              <Grid.Column widescreen={10} computer={10} tablet={16} mobile={16} className="">
                <CurrentComponent offerings={offerings} isMobile={isMobile} path={stepToRender.image} />
                {stepToRender.note && stepToRender.note}
              </Grid.Column>
            </Grid>
          </Container>
        </Modal.Content>
      </Modal>
    );
  }
}
