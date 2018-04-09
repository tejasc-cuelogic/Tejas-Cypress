import React from 'react';
import { Modal, Header, Button } from 'semantic-ui-react';

export default class MultiStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPreviousBtn: false,
      showNextBtn: true,
      compState: 0,
      navState: this.getNavStates(0, this.props.steps.length),
    };
    this.hidden = {
      display: 'none',
    };
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  getNavStates(indx, length) {
    console.log(this);
    const styles = [];
    /* eslint-disable no-plusplus */
    for (let i = 0; i < length; i++) {
      if (i < indx) {
        styles.push('done');
      } else if (i === indx) {
        styles.push('doing');
      } else {
        styles.push('todo');
      }
    }
    return { current: indx, styles };
  }

  getClassName(className, i) {
    return `${className}-${this.state.navState.styles[i]}`;
  }

  setNavState(next) {
    this.setState({ navState: this.getNavStates(next, this.props.steps.length) });
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
        showPreviousBtn: false,
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
    if (evt.which === 13) {
      this.next();
    }
  }

  handleOnClick(evt) {
    if (evt.currentTarget.value === (this.props.steps.length - 1) &&
      this.state.compState === (this.props.steps.length - 1)) {
      this.setNavState(this.props.steps.length);
    } else {
      this.setNavState(evt.currentTarget.value);
    }
  }

  next() {
    this.setNavState(this.state.compState + 1);
  }

  previous() {
    if (this.state.compState > 0) {
      this.setNavState(this.state.compState - 1);
    }
  }

  renderSteps() {
    return this.props.steps.map((s, i) => (
      /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
      /* eslint-disable jsx-a11y/click-events-have-key-events */
      /* eslint-disable react/no-array-index-key */
      <li className={this.getClassName('progtrckr', i)} onClick={this.handleOnClick} key={i} value={i}>
        {/* <em>{i + 1}</em> */}
        {this.props.steps[i].name}
      </li>
    ));
  }

  render() {
    return (
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      <div onKeyDown={this.handleKeyDown}>
        <Modal size="tiny" basic open closeIcon className="multistep-modal">
          <Header as="h1" textAlign="center">Individual  account creation</Header>
          <ol className="progtrckr">
            {this.renderSteps()}
          </ol>
          <Modal.Content className="multistep">
            {this.props.steps[this.state.compState].component}
            <Button
              circular
              icon="arrow left"
              // style={this.state.showPreviousBtn ? {} : this.hidden}
              className={(this.state.showPreviousBtn ? 'multistep__btn prev' : 'multistep__btn prev disabled')}
              onClick={this.previous}
            />
            <Button
              circular
              icon="arrow right"
              // style={this.state.showNextBtn ? {} : this.hidden}
              className={(this.state.showNextBtn ? 'multistep__btn next active' : 'multistep__btn next disabled')}
              onClick={this.next}
            />
            {/* <div className="multistep-nav" style={this.props.showNavigation ? {} : this.hidden}>
            </div> */}
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

MultiStep.defaultProps = {
  showNavigation: true,
};
