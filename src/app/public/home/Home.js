import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Banner from './components/Banner';
import MainView from './components/MainView';
import authActions from './../../../actions/auth';
@inject('commonStore')
@withRouter
@observer
export default class Home extends React.Component {
  componentDidMount() {
    authActions.verifySession();
  }
  render() {
    const { token, appName } = this.props.commonStore;
    return (
      <div className="home-page">
        <Banner token={token} appName={appName} />

        <div className="container page">
          <div className="row">
            <MainView />
          </div>
        </div>
      </div>
    );
  }
}
