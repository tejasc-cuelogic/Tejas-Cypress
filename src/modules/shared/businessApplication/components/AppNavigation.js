import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import Helper from '../../../../helper/utility';

@inject('businessAppStore', 'uiStore')
@withRouter
@observer
export default class AppNavigation extends Component {
  state = { step: -1, navItems: [] };

  componentDidMount() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url).subNavigations;
    const step = navItems.findIndex(i => i.to === (match.url.split('/')[5]));
    this.setState({ step, navItems });
  }

  actualSubmit = (where) => {
    const {
      // checkFormisValid,
      currentApplicationId, currentApplicationType,
    } = this.props.businessAppStore;
    if (where >= 0) {
      // if (checkFormisValid(`${this.state.navItems[this.state.step].to}`, true)) {
      this.submitSaveContinue();
      this.props.history.push(`/app/business-application/${currentApplicationType}/${currentApplicationId}/${this.state.navItems[this.state.step + where].to}`);
      // }
    } else {
      this.props.history.push(`/app/business-application/${currentApplicationType}/${currentApplicationId}/${this.state.navItems[this.state.step + where].to}`);
    }
  }

  submitSaveContinue = () => {
    this.props.businessAppStore.businessAppParitalSubmit();
  }

  submit = (e) => {
    e.preventDefault();
    const {
      // checkFormisValid,
      currentApplicationId,
      currentApplicationType, businessAppParitalSubmit, businessApplicationSubmitAction,
    } = this.props.businessAppStore;
    // if (checkFormisValid(`${this.state.navItems[this.state.step].to}`, true)) {
    businessAppParitalSubmit().then((result) => {
      if (result && this.props.businessAppStore.canSubmitApp) {
        businessApplicationSubmitAction().then(() => {
          Helper.toast('Business application submitted successfully!', 'success');
          this.props.history.push('/app/dashboard');
        });
      } else {
        this.props.history.push(`/app/business-application/${currentApplicationType}/${currentApplicationId}/${this.state.navItems[this.state.step].to}`);
      }
    });
    // }
  }

  render() {
    const { isFileUploading, formReadOnlyMode, ButtonTextToggle } = this.props.businessAppStore;
    const { inProgress } = this.props.uiStore;
    return (
      <>
        {!this.props.hideFields
          && (
<div className="navigation-buttons">
            {!formReadOnlyMode
              && (
              <>
                {this.state.step > 0
                  && (
<div className="pull-left">
                    <Button type="button" circular icon className="multistep__btn prev" disabled={isFileUploading} onClick={() => this.actualSubmit(-1)}>
                      <Icon className="ns-arrow-left" />
                    </Button>
                    {this.state.navItems[this.state.step - 1].title}
                  </div>
                  )
                }
                <div className="pull-right">
                  {this.state.step < (this.state.navItems.length - 1) ? (
                    <>
                      {this.state.navItems[this.state.step + 1].title}
                      <Button type="button" circular icon primary className={`multistep__btn next ${isFileUploading ? '' : 'active'}`} disabled={isFileUploading} onClick={() => this.actualSubmit(1)}>
                        <Icon className="ns-arrow-right" />
                      </Button>
                    </>
                  )
                    : (
<>
                      {/* <Button onClick={() => this.actualSubmit(0)} disabled={isFileUploading}
                    primary className="very relaxed" content={isFileUploading
                    ? 'File operation in process' : 'Save'} /> */}
                      <Button type="button" loading={inProgress} onClick={this.submit} disabled={isFileUploading} primary className="very relaxed" content={isFileUploading ? 'File operation in process' : ButtonTextToggle} />
                    </>
                    )
                  }
                </div>
              </>
              )
            }
          </div>
          )
        }
      </>
    );
  }
}
