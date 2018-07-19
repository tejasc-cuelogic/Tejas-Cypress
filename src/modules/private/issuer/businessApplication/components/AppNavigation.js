import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { GetNavMeta } from '../../../../../theme/layout/SidebarNav';
import Helper from '../../../../../helper/utility';

@inject('newBusinessStore')
@withRouter
@observer
export default class AppNavigation extends Component {
  state = { step: -1, navItems: [] };
  componentWillMount() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url).subNavigations;
    const step = navItems.findIndex(i => i.to === (match.url.split('/')[4]));
    this.setState({ step, navItems });
  }
  actualSubmit = (where) => {
    this.props.action();
    this.props.history.push(`/app/business-application/${this.props.newBusinessStore.currentApplicationId}/${this.state.navItems[this.state.step + where].to}`);
  }
  submit = () => {
    this.props.newBusinessStore.businessApplicationSubmitAction().then(() => {
      Helper.toast('Business application submitted successfully!', 'success');
      this.props.history.push('/app/dashboard');
    });
  }
  render() {
    return (
      <div className="navigation-buttons">
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
          ) : <Button disabled={!this.props.canSubmitApp} primary className="very relaxed" content="Submit" />
          }
        </div>
      </div>
    );
  }
}
