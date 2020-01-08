import React from 'react';
import _ from 'lodash';
import Parser from 'html-react-parser';
import { Modal, Header, Button, Dimmer, Loader, Progress } from 'semantic-ui-react';
import Helper from '../utility';

const isMobile = document.documentElement.clientWidth < 768;
const hasData = compState => compState.validForm;
const isAccountCreation = Helper ? Helper.matchRegexWithUrl([/\baccount-creation(?![-])\b/, /\bestablish-profile(?![-])\b/]) : false;

const getNavStates = (indx, length, steps) => {
  const styles = [];
  /* eslint-disable no-plusplus */
  // eslint-disable-next-line max-len
  for (let i = 0; i < length; i++) {
    if ((isAccountCreation && hasData(steps[i]) && i !== indx) || i < indx) {
      styles.push('done');
    } else if (i === indx) {
      styles.push('doing');
    } else {
      styles.push('todo');
    }
  }
  return { current: indx, styles };
};
export default class MultiStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPreviousBtn: false,
      showNextBtn: true,
      compState: this.props.stepToBeRendered || 0,
      navState: getNavStates(
        (this.props.stepToBeRendered || 0), this.props.steps.length,
        this.props.steps,
      ),
    };
    this.hidden = {
      display: 'none',
    };
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  componentDidMount() {
    if (this.props.setUiStorevalue) {
      this.props.setUiStorevalue('multiSteps', this.props.steps);
    }

    if (typeof this.props.stepToBeRendered !== 'undefined' && this.props.stepToBeRendered !== '') {
      this.setNavState(this.props.stepToBeRendered);
    }
    if (this.props.stepToBeRendered > -1 && _.has(this.props.steps[this.props.stepToBeRendered], 'disableNxtBtn')) {
      this.setState({ showNextBtn: !this.props.steps[this.props.stepToBeRendered].disableNxtBtn });
    }
  }

  static getDerivedStateFromProps(nextProps) {
    const stateObj = {};
    if (typeof nextProps.stepToBeRendered !== 'undefined' && nextProps.stepToBeRendered !== '') {
      stateObj.navState = getNavStates(
        nextProps.stepToBeRendered, nextProps.steps.length,
        nextProps.steps,
      );
      if (nextProps.stepToBeRendered < nextProps.steps.length) {
        stateObj.compState = nextProps.stepToBeRendered;
      }
      if (nextProps.stepToBeRendered > 0 && nextProps.stepToBeRendered < nextProps.steps.length - 1) {
        stateObj.showPreviousBtn = true;
        stateObj.showNextBtn = true;
      } else if (nextProps.stepToBeRendered === 0) {
        stateObj.showPreviousBtn = !nextProps.disablePrevBtn;
        stateObj.showNextBtn = true;
      } else {
        stateObj.showPreviousBtn = true;
        stateObj.showNextBtn = false;
      }
    }
    if (nextProps.stepToBeRendered > -1 && _.has(nextProps.steps[nextProps.stepToBeRendered], 'disableNxtBtn')) {
      stateObj.showNextBtn = !nextProps.steps[nextProps.stepToBeRendered].disableNxtBtn;
    }
    if (typeof nextProps.disableNxtbtn !== 'undefined') {
      stateObj.showNextBtn = nextProps.disableNxtbtn;
    }
    if (!_.isEmpty(stateObj)) {
      return stateObj;
    }
    return null;
  }

  getClassName(className, i) {
    let currentStatus = this.state.navState.styles[i];
    if (!this.state.navState.styles[i]) {
      currentStatus = 'todo';
    }
    return `${className}-${currentStatus}`;
  }

  setNavState(next) {
    this.setState({
      navState: getNavStates(
        next, this.props.steps.length,
        this.props.steps,
      ),
    });
    if (next < this.props.steps.length) {
      this.setState({ compState: next });
    }
    this.checkNavState(next);
  }

  checkNavState(currentStep) {
    if (currentStep > 0 && currentStep < this.props.steps.length - 1) {
      this.setState({
        showPreviousBtn: true,
        showNextBtn: true,
      });
    } else if (currentStep === 0) {
      this.setState({
        showPreviousBtn: !this.props.disablePrevBtn,
        showNextBtn: true,
      });
    } else {
      this.setState({
        showPreviousBtn: true,
        showNextBtn: false,
      });
    }
  }

  handleKeyDown(evt) {
    if ((evt.which === 13 && (evt.target.name !== 'bankName')
      && (!this.props.steps[this.state.compState].disableNextButton)
      && !this.props.steps[this.state.compState].disableKeyDown)) {
      this.next();
    }
  }

  handleOnClick(evt) {
    if (!this.props.steps[this.state.compState].onlyDisableNextButton
      && !this.props.formHeaderClick) {
      if (this.props.setStepTobeRendered) {
        this.props.setStepTobeRendered(evt.currentTarget.value);
        if (evt.currentTarget.value === (this.props.steps.length - 1)
          && this.state.compState === (this.props.steps.length - 1)) {
          this.setNavState(this.props.steps.length);
        } else if (evt.currentTarget.value !== 0
          && this.props.steps[(evt.currentTarget.value - 1)].isDirty) {
          this.props.createAccount(this.props.steps[(evt.currentTarget.value - 1)]);
          if (evt.currentTarget.value === (this.props.steps.length - 1)) {
            this.setNavState(evt.currentTarget.value);
          }
        } else {
          this.setNavState(evt.currentTarget.value);
        }
      } else {
        this.setNavState(evt.currentTarget.value);
      }
    }
  }

  next() {
    if (!this.props.steps[this.state.compState].isDirty) {
      if (this.props.isAccountCreation) {
        if (this.props.steps[this.state.compState].validForm) {
          this.setNavState(this.state.compState + 1);
          this.props.setStepTobeRendered(this.state.compState + 1);
        } else {
          this.props.createAccount(this.props.steps[this.state.compState]);
        }
      } else {
        this.setNavState(this.state.compState + 1);
        this.props.setStepTobeRendered(this.state.compState + 1);
      }
      const modalEle = document.getElementById('multistep-modal');
      if (modalEle && isMobile) {
        modalEle.parentNode.scrollTo(0, 0);
      }
    } else {
      if (this.props.isAccountCreation && isMobile) {
        this.props.createAccount(this.props.steps[this.state.compState]).then(() => {
          const modalEle = document.getElementById('multistep-modal');
          if (modalEle && isMobile) {
            setTimeout(() => modalEle.parentNode.scrollTo(0, 0), 100);
          }
        });
      } else {
        this.props.createAccount(this.props.steps[this.state.compState]);
      }
      if (!this.props.steps[this.state.compState].isDirty) {
        this.setNavState(this.state.compState + 1);
        this.props.setStepTobeRendered(this.state.compState + 1);
      }
    }
  }

  previous() {
    if (this.props.inProgressArray && this.props.inProgressArray.length) {
      this.props.setUiStorevalue('inProgressArray', []);
      return;
    }
    if (this.state.compState > 0) {
      if (this.props.isAccountCreation) {
        if (this.props.steps[this.state.compState].addFunds) {
          this.props.setLinkbankSummary();
          this.setNavState(this.state.compState - 1);
          this.props.setStepTobeRendered(this.state.compState - 1);
        } else if (this.props.isAddFundsScreen) {
          this.props.setLinkbankSummary();
        } else {
          this.setNavState(this.state.compState - 1);
          this.props.setStepTobeRendered(this.state.compState - 1);
        }
      } else {
        this.setNavState(this.state.compState - 1);
        this.props.setStepTobeRendered(this.state.compState - 1);
      }
    } else if (this.state.compState === 0 && this.props.setStepTobeRenderedForAlert) {
      this.setNavState(0);
      this.props.setStepTobeRenderedForAlert();
    }
  }

  /**
   * @todo Remove eslint-disbable comments and make appripriate changes
   */
  /* eslint-disable arrow-body-style */
  renderSteps() {
    return this.props.steps.map((s, i) => {
      /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
      /* eslint-disable jsx-a11y/click-events-have-key-events */
      /* eslint-disable react/no-array-index-key */
      return (
        <>
          {this.props.steps[i].name
            && (
              <li className={`${this.getClassName('progtrckr', i)} ${this.props.steps[i].isValid} ${this.props.steps[i].isHideLabel ? 'hidden' : ''}`} onClick={this.handleOnClick} key={i} value={i}>
                {this.props.steps[i].name}
              </li>
            )
          }
        </>
      );
    });
  }

  render() {
    const currentStep = this.props.steps[this.state.compState];
    if (this.props.isEnterPressed
      && !currentStep.disableNextButton) {
      this.props.resetEnterPressed();
      this.next();
    }
    const closeDimmerClickAction = this.props.closeOnDimmerClick ? this.props.closeOnDimmerClick : false;
    return (
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      <div onKeyDown={!currentStep.disableNextButton
        ? this.handleKeyDown : false}
      >
        <Modal
          onKeyPress={event => this.props.setIsEnterPressed(event)}
          basic
          open
          closeIcon={!isMobile}
          className={`${isMobile && 'bg-white'} ${this.props.inProgress && 'dimmer-visible'} multistep-modal`}
          closeOnDimmerClick={closeDimmerClickAction}
          onClose={() => this.props.handleMultiStepModalclose()}
          id="multistep-modal"
          dimmer={isMobile && 'inverted'}
          centered={!isMobile}
        >
          {!this.props.hideHeader
            && (
              <>
                {!isMobile
                  ? (
                    <>
                      <Header as="h2" textAlign="center">{this.props.formTitle}</Header>
                      <ol className="progtrckr">
                        {!currentStep.isHideLabel
                          && this.renderSteps()
                        }
                      </ol>
                    </>
                  )
                  : (
                    <Modal.Header className="text-uppercase">
                      {!currentStep.disablePrevButton
                        && (
                          <Button
                            icon={{ className: 'ns-chevron-left' }}
                            className={`${this.state.showPreviousBtn ? '' : 'disabled'} multistep__btn prev`}
                            onClick={this.previous}
                          />
                        )
                      }
                      {!currentStep.isHideName
                        ? currentStep.name : ''
                      }
                      <Button
                        icon={{ className: 'ns-close-light' }}
                        className="link-button pull-right multistep__btn"
                        onClick={this.props.handleMultiStepModalclose}
                      />
                      <Progress className={(currentStep.name === '' || currentStep.isHideName) ? 'no-header' : ''} percent={((this.state.compState + 1) / (this.props.steps.length + 1)) * 100} attached="bottom" color="green" />
                    </Modal.Header>
                  )
                }
              </>
            )
          }
          <Dimmer active={this.props.inProgress} className={this.props.inProgress && 'fullscreen' ? 'fullscreen' : ''}>
            <Loader active={this.props.inProgress}>
              {this.props.loaderMsg ? Parser(this.props.loaderMsg) : ''}
            </Loader>
          </Dimmer>
          <Modal.Content className="multistep">
            {currentStep.component}
            {!currentStep.disablePrevButton && !isMobile
              && (
                <Button
                  circular
                  icon={{ className: 'ns-arrow-left' }}
                  className={(this.state.showPreviousBtn ? 'multistep__btn prev' : 'multistep__btn prev disabled')}
                  onClick={this.previous}
                />
              )
            }
            {(this.props.isStepButtonsVisible === undefined || this.state.compState !== 0
              || (this.props.isStepButtonsVisible && this.props.isStepButtonsVisible === true)) && !isMobile
              ? (
                <>
                  {!currentStep.disableNextButton
                    && (
                      <>
                        {isMobile ? (
                          <Button
                            className={(this.state.showNextBtn && !currentStep.onlyDisableNextButton) ? 'active' : 'disabled'}
                            onClick={this.next}
                            primary
                            content="Next"
                            fluid
                          />
                        ) : (
                            <Button
                              type="submit"
                              circular
                              icon={{ className: 'ns-arrow-right' }}
                              className={`${(this.state.showNextBtn && !currentStep.onlyDisableNextButton) ? 'active' : 'disabled'} multistep__btn next`}
                              onClick={this.next}
                            />
                        )}
                      </>
                    )
                  }
                </>
              )
              : null
            }
          </Modal.Content>
          {/* {(this.props.isStepButtonsVisible === undefined || this.state.compState !== 0
              || (this.props.isStepButtonsVisible && this.props.isStepButtonsVisible === true)) && isMobile
            ? (
                <Aux>
                  {!currentStep.disableNextButton
                    && (
                    <Button
                      className={(this.state.showNextBtn && !currentStep.onlyDisableNextButton) ? 'active' : 'disabled'}
                      onClick={this.next}
                      attached="bottom"
                      primary
                      content="Next"
                    />
                    )
                  }
                </Aux>
            )
            : null
          } */}
        </Modal>
      </div>
    );
  }
}

MultiStep.defaultProps = {
  showNavigation: true,
};
