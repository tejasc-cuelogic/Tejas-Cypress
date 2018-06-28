import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Loadable from 'react-loadable';
import { Image, Button } from 'semantic-ui-react';
import PrivateLayout from '../../../shared/PrivateHOC';
import Helper from '../../../../../helper/utility';
import { GetNavMeta } from '../../../../../theme/layout/SidebarNav';
import LogoWhite from '../../../../../assets/images/nextseed_logo_white_green.svg';

const getModule = component => Loadable({
  loader: () => import(`../components/${component}`),
  loading() {
    return <div>Loading...</div>;
  },
});

@inject('newBusinessStore', 'uiStore')
@observer
export default class BusinessApplication extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/pre-qualification`);
    }
  }
  saveContinue = () => {
    Helper.toast('Business application saved!', 'success');
    this.props.history.push('/app/dashboard');
  }
  submit = () => {
    Helper.toast('Business application submitted successfully!', 'success');
    this.props.history.push('/app/dashboard');
  }
  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url).subNavigations;
    const { canSubmitApp } = this.props.newBusinessStore;
    return (
      <PrivateLayout
        {...this.props}
        P0={
          <Image
            src={LogoWhite}
            alt="NextSeed.com"
            className="logo"
            verticalAlign="middle"
            as={Link}
            to="/app/business-application"
            size="small"
          />
        }
        P4={
          <Button.Group>
            <Button inverted onClick={this.saveContinue} color="green">Save and Continue later</Button>
            <Button
              onClick={this.submit}
              className={canSubmitApp ? 'primary' : 'grey'}
              disabled={!canSubmitApp}
            >
              Submit
            </Button>
          </Button.Group>
        }
      >
        <Switch>
          <Route exact path={match.url} component={getModule(navItems[0].component)} />
          {
            navItems.map(item => (
              <Route key={item.to} path={`${match.url}/${item.to}`} component={getModule(item.component)} />
            ))
          }
        </Switch>
      </PrivateLayout>
    );
  }
}
