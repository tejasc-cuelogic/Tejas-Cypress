import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import Aux from 'react-aux';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';

@withRouter
export default class AppNavigation extends Component {
  state = { step: -1, navItems: [] };
  componentWillMount() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url).subNavigations;
    const step = navItems.findIndex(i => i.to === (match.url.split('/')[3]));
    this.setState({ step, navItems });
  }
  actualSubmit = (where) => {
    this.props.action();

    this.props.history.push(`/app/business-application/${this.state.navItems[this.state.step + where].to}`);
  }
  render() {
    console.log(this.state.step);
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
          ) : <Button primary className="very relaxed" content="Submit" />
          }
        </div>
      </div>
    );
  }
}
