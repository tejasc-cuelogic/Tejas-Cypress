import React from 'react';
import _ from 'lodash';
import Aux from 'react-aux';
import Parser from 'html-react-parser';
import { Modal, Header, Button, Dimmer, Loader } from 'semantic-ui-react';
import Helper from '../../helper/utility';


const hasData = compState => compState.validForm;
const getNavStates = (indx, length, steps) => {
  const styles = [];
  /* eslint-disable no-plusplus */
  // eslint-disable-next-line max-len
  // const isAccountCreation = window.location.href.includes('account-creation') || window.location.href.includes('establish-profile');
  const isAccountCreation = Helper.matchRegexWithUrl([/\baccount-creation(?![-])\b/, /\bestablish-profile(?![-])\b/]);
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
  componentWillMount() {
    if (typeof this.props.stepToBeRendered !== 'undefined' && this.props.stepToBeRendered !== '') {
      this.setNavState(this.props.stepToBeRendered);
    }
    if (this.props.stepToBeRendered > -1 && _.has(this.props.steps[this.props.stepToBeRendered], 'disableNxtBtn')) {
      this.setState({ showNextBtn: !this.props.steps[this.props.stepToBeRendered].disableNxtBtn });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.stepToBeRendered !== 'undefined' && nextProps.stepToBeRendered !== '') {
      this.setNavState(nextProps.stepToBeRendered);
    }
    if (nextProps.stepToBeRendered > -1 && _.has(nextProps.steps[nextProps.stepToBeRendered], 'disableNxtBtn')) {
      this.setState({ showNextBtn: !nextProps.steps[nextProps.stepToBeRendered].disableNxtBtn });
    }
    if (typeof nextProps.disableNxtbtn !== 'undefined') {
      this.setState({ showNextBtn: nextProps.disableNxtbtn });
    }
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
    if ((evt.which === 13 && (evt.target.name !== 'bankName') &&
      (!this.props.steps[this.state.compState].disableNextButton))) {
      this.next();
    }
  }

  handleOnClick(evt) {
    if (!this.props.steps[this.state.compState].onlyDisableNextButton &&
      !this.props.formHeaderClick) {
      if (this.props.setStepTobeRendered) {
        this.props.setStepTobeRendered(evt.currentTarget.value);
        if (evt.currentTarget.value === (this.props.steps.length - 1) &&
          this.state.compState === (this.props.steps.length - 1)) {
          this.setNavState(this.props.steps.length);
        } else if (evt.currentTarget.value !== 0 &&
          this.props.steps[(evt.currentTarget.value - 1)].isDirty) {
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
      this.setNavState(this.state.compState + 1);
      if (this.props.bankSummary &&
        this.props.bankSummary(this.props.steps[this.state.compState])) {
        this.props.bankSummarySubmit();
      } else {
        this.props.setStepTobeRendered(this.state.compState + 1);
      }
    } else {
      this.props.createAccount(this.props.steps[this.state.compState]);
      if (!this.props.steps[this.state.compState].isDirty) {
        this.setNavState(this.state.compState + 1);
        this.props.setStepTobeRendered(this.state.compState + 1);
      }
    }
  }

  previous() {
    if (this.state.compState > 0) {
      this.setNavState(this.state.compState - 1);
      this.props.setStepTobeRendered(this.state.compState - 1);
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
        <li className={`${this.getClassName('progtrckr', i)} ${this.props.steps[i].isValid} ${this.props.steps[i].isHideLabel ? 'hidden' : ''}`} onClick={this.handleOnClick} key={i} value={i}>
          {this.props.steps[i].name}
        </li>
      );
    });
  }

  render() {
    if (this.props.isEnterPressed &&
      !this.props.steps[this.state.compState].disableNextButton) {
      this.props.resetEnterPressed();
      this.next();
    }
    const closeDimmerClickAction =
      this.props.closeOnDimmerClick ? this.props.closeOnDimmerClick : false;
    return (
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      <div onKeyDown={!this.props.steps[this.state.compState].disableNextButton ?
        this.handleKeyDown : false}
      >
        <Modal
          onKeyPress={event => this.props.setIsEnterPressed(event)}
          basic
          open
          closeIcon
          className={`${this.props.inProgress && 'dimmer-visible'} multistep-modal`}
          closeOnDimmerClick={closeDimmerClickAction}
          onClose={() => this.props.handleMultiStepModalclose()}
        >
          {!this.props.hideHeader &&
            <Aux>
              <Header as="h2" textAlign="center">{this.props.formTitle}</Header>
              <ol className="progtrckr">
                {!this.props.steps[this.state.compState].isHideLabel &&
                  this.renderSteps()
                }
              </ol>
            </Aux>
          }
          <Dimmer active={this.props.inProgress} className={this.props.inProgress && 'fullscreen' ? 'fullscreen' : ''}>
            <Loader active={this.props.inProgress} >
              {this.props.loaderMsg ? Parser(this.props.loaderMsg) : ''}
            </Loader>
          </Dimmer>
          <Modal.Content className="multistep">
            {this.props.steps[this.state.compState].component}
            {!this.props.steps[this.state.compState].disablePrevButton &&
              <Button
                circular
                icon={{ className: 'ns-arrow-left' }}
                className={(this.state.showPreviousBtn ? 'multistep__btn prev' : 'multistep__btn prev disabled')}
                onClick={this.previous}
              />
            }
            {this.props.isStepButtonsVisible === undefined || this.state.compState !== 0 ||
              (this.props.isStepButtonsVisible && this.props.isStepButtonsVisible === true) ?
                <Aux>
                  {!this.props.steps[this.state.compState].disableNextButton &&
                    <Button
                      type="submit"
                      circular
                      icon={{ className: 'ns-arrow-right' }}
                      className={(this.state.showNextBtn && !this.props.steps[this.state.compState].onlyDisableNextButton) ? 'multistep__btn next active' : 'multistep__btn next disabled'}
                      onClick={this.next}
                    />
                  }
                </Aux>
              :
              null
            }
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

MultiStep.defaultProps = {
  showNavigation: true,
};
