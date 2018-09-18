import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import Helper from '../../../../helper/utility';

@inject('businessAppStore', 'uiStore')
@withRouter
@observer
export default class AppNavigation extends Component {
  state = { step: -1, navItems: [] };
  componentWillMount() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url).subNavigations;
    const step = navItems.findIndex(i => i.to === (match.url.split('/')[5]));
    this.setState({ step, navItems });
  }
  actualSubmit = (where) => {
    const { checkFormisValid, currentApplicationId } = this.props.businessAppStore;
    if (where >= 0) {
      if (checkFormisValid(`${this.state.navItems[this.state.step].to}`, true)) {
        this.submitSaveContinue(`${this.state.navItems[this.state.step].to}`);
        this.props.history.push(`/app/business-application/${currentApplicationId}/${this.state.navItems[this.state.step + where].to}`);
      }
    } else {
      this.props.history.push(`/app/business-application/${currentApplicationId}/${this.state.navItems[this.state.step + where].to}`);
    }
  }

  submitSaveContinue = (stepUrl) => {
    this.props.businessAppStore.businessAppParitalSubmit(stepUrl);
  }

  submit = (e) => {
    e.preventDefault();
    this.props.businessAppStore.businessApplicationSubmitAction().then(() => {
      Helper.toast('Business application submitted successfully!', 'success');
      this.props.history.push('/app/dashboard');
    });
  }
  render() {
    const { isFileUploading, canSubmitApp, formReadOnlyMode } = this.props.businessAppStore;
    const { inProgress } = this.props.uiStore;
    return (
      <Aux>
        {!this.props.hideFields &&
          <div className="navigation-buttons">
            {!formReadOnlyMode &&
              <Aux>
                {this.state.step > 0 &&
                  <div className="pull-left">
                    <Button circular icon className="multistep__btn prev" onClick={() => this.actualSubmit(-1)}>
                      <Icon className="ns-arrow-left" />
                    </Button>
                    {this.state.navItems[this.state.step - 1].title}
                  </div>
                }
                <div className="pull-right">
                  {this.state.step < (this.state.navItems.length - 1) ? (
                    <Aux>
                      {this.state.navItems[this.state.step + 1].title}
                      <Button circular icon primary className="multistep__btn next active" onClick={() => this.actualSubmit(1)}>
                        <Icon className="ns-arrow-right" />
                      </Button>
                    </Aux>
                  ) :
                    <Aux>
                      <Button onClick={() => this.actualSubmit(0)} disabled={isFileUploading} primary className="very relaxed" content={isFileUploading ? 'File operation in process' : 'Save'} />
                      <Button loading={inProgress} onClick={this.submit} disabled={!canSubmitApp} primary className="very relaxed" content="Submit" />
                    </Aux>
                  }
                </div>
              </Aux>
            }
          </div>
        }
      </Aux>
    );
  }
}
