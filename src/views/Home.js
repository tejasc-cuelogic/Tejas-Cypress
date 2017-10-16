import Banner from '../components/Home/Banner';
import MainView from '../components/Home/MainView';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@inject('commonStore')
@withRouter
@observer
export default class Home extends React.Component {

  render() {
    const { token, appName } = this.props.commonStore;
    return (
      <div className="home-page">

        <Banner token={token} appName={appName} />

        <div className="container page">
          <div className="row">
            <MainView />

            <div className="col-md-3">
              <div className="sidebar">

                <p>Side Bar</p>

              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
